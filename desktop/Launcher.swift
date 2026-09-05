import AppKit
import Foundation

final class LauncherDelegate: NSObject, NSApplicationDelegate {
    private var window: NSWindow!
    private var statusLabel: NSTextField!
    private var openButton: NSButton!
    private var retryButton: NSButton!
    private var process: Process?
    private var logHandle: FileHandle?
    private var timer: Timer?
    private var polling = false
    private var quitting = false
    private var browserOpened = false
    private var attempts = 0
    private var instance = ""
    private let pageURL = URL(string: "http://localhost:4173/")!
    private let logURL = FileManager.default.temporaryDirectory.appendingPathComponent("first-steps-english.log")
    private lazy var session: URLSession = {
        let config = URLSessionConfiguration.ephemeral
        config.timeoutIntervalForRequest = 2
        config.timeoutIntervalForResource = 3
        config.urlCache = nil
        return URLSession(configuration: config)
    }()

    func applicationDidFinishLaunching(_ notification: Notification) {
        let mainMenu = NSMenu()
        let appItem = NSMenuItem()
        mainMenu.addItem(appItem)
        let menu = NSMenu()
        menu.addItem(withTitle: "退出初言英语", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        appItem.submenu = menu
        NSApplication.shared.mainMenu = mainMenu

        window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: 500, height: 330),
                          styleMask: [.titled, .closable, .miniaturizable], backing: .buffered, defer: false)
        window.title = "初言英语"
        window.isReleasedWhenClosed = false
        window.center()
        let content = window.contentView!

        let icon = NSImageView(frame: NSRect(x: 224, y: 260, width: 52, height: 44))
        icon.image = NSImage(systemSymbolName: "book.closed.fill", accessibilityDescription: "英语学习")
        icon.contentTintColor = .systemTeal
        icon.imageScaling = .scaleProportionallyUpOrDown
        content.addSubview(icon)

        label("初言英语 · 本地学习", y: 217, height: 32, font: .systemFont(ofSize: 25, weight: .semibold))
        label("自然拼读 · 邪修语法 · 听写 · 拼图 · 开口练习", y: 187, height: 24, font: .systemFont(ofSize: 14), color: .secondaryLabelColor)
        statusLabel = label("正在启动…", y: 132, height: 45, font: .systemFont(ofSize: 14))

        openButton = button("打开学习网页", x: 94, y: 83, width: 150, action: #selector(openPage))
        openButton.keyEquivalent = "\r"
        openButton.isEnabled = false
        retryButton = button("重新启动", x: 256, y: 83, width: 150, action: #selector(start))
        retryButton.isEnabled = false
        label("使用时请保留本应用；退出后会停止本地语音服务。", y: 49, height: 22,
              font: .systemFont(ofSize: 12), color: .secondaryLabelColor)
        _ = button("查看启动日志", x: 183, y: 12, width: 134, action: #selector(openLog))

        window.makeKeyAndOrderFront(nil)
        NSApplication.shared.activate(ignoringOtherApps: true)
        start()
    }

    @discardableResult
    private func label(_ text: String, y: CGFloat, height: CGFloat, font: NSFont, color: NSColor = .labelColor) -> NSTextField {
        let field = NSTextField(wrappingLabelWithString: text)
        field.frame = NSRect(x: 24, y: y, width: 452, height: height)
        field.alignment = .center
        field.font = font
        field.textColor = color
        window.contentView!.addSubview(field)
        return field
    }

    private func button(_ title: String, x: CGFloat, y: CGFloat, width: CGFloat, action: Selector) -> NSButton {
        let b = NSButton(title: title, target: self, action: action)
        b.bezelStyle = .rounded
        b.frame = NSRect(x: x, y: y, width: width, height: 32)
        window.contentView!.addSubview(b)
        return b
    }

    private func health(_ completion: @escaping ([String: Any]?, Bool) -> Void) {
        let url = pageURL.appendingPathComponent("api/health")
        session.dataTask(with: url) { data, response, error in
            let result = data.flatMap { try? JSONSerialization.jsonObject(with: $0) as? [String: Any] }
            DispatchQueue.main.async { completion(result, response != nil && error == nil) }
        }.resume()
    }

    @objc private func start() {
        guard process?.isRunning != true else { return }
        timer?.invalidate()
        statusLabel.stringValue = "正在检查本地学习服务…"
        retryButton.isEnabled = false
        openButton.isEnabled = false
        browserOpened = false
        health { [weak self] info, responded in
            guard let self = self, !self.quitting else { return }
            if info?["app"] as? String == "first-steps-english", info?["offline"] as? Bool == true {
                self.instance = info?["instance"] as? String ?? ""
                self.beginPolling()
            } else if responded {
                self.fail("旧版预览或其他程序正在占用学习地址。\n请关闭旧服务，再点“重新启动”。")
            } else {
                self.launchServer()
            }
        }
    }

    private func launchServer() {
        guard let resources = Bundle.main.resourceURL,
              let executable = Bundle.main.executableURL else { fail("安装文件不完整，请重新安装。"); return }
        let task = Process()
        instance = UUID().uuidString
        task.executableURL = executable.deletingLastPathComponent().appendingPathComponent("node")
        task.currentDirectoryURL = resources.appendingPathComponent("web")
        task.arguments = [resources.appendingPathComponent("web/server.mjs").path]
        var env = ProcessInfo.processInfo.environment
        env.removeValue(forKey: "NODE_OPTIONS")
        env.removeValue(forKey: "NODE_PATH")
        env["PATH"] = "/usr/bin:/bin:/usr/sbin:/sbin"
        env["PORT"] = "4173"
        env["FIRST_STEPS_OFFLINE"] = "1"
        env["FIRST_STEPS_INSTANCE"] = instance
        task.environment = env
        FileManager.default.createFile(atPath: logURL.path, contents: Data())
        logHandle = try? FileHandle(forWritingTo: logURL)
        task.standardOutput = logHandle
        task.standardError = logHandle
        task.terminationHandler = { [weak self] stopped in
            DispatchQueue.main.async {
                guard let self = self, !self.quitting, self.process === stopped else { return }
                self.timer?.invalidate()
                self.fail("本地服务已停止。请点击“重新启动”。\n若仍然失败，可查看启动日志。")
            }
        }
        process = task
        do {
            try task.run()
            statusLabel.stringValue = "正在打开网页并加载本地语音模型…"
            beginPolling()
        } catch {
            fail("无法启动本地服务：\(error.localizedDescription)")
        }
    }

    private func beginPolling() {
        attempts = 0
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in self?.poll() }
        poll()
    }

    private func poll() {
        guard !polling else { return }
        polling = true
        health { [weak self] info, _ in
            guard let self = self else { return }
            self.polling = false
            guard !self.quitting else { return }
            self.attempts += 1
            guard info?["app"] as? String == "first-steps-english", info?["instance"] as? String == self.instance else {
                if self.attempts >= 45 {
                    self.timer?.invalidate()
                    self.fail("本地服务没有及时响应，请退出后重新打开。\n启动日志中保留了错误信息。")
                }
                return
            }
            self.openButton.isEnabled = true
            if !self.browserOpened { self.browserOpened = true; self.openPage() }
            let models = info?["models"] as? [String: Any] ?? [:]
            if models["tts"] as? String == "就绪", models["asr"] as? String == "就绪" {
                self.statusLabel.stringValue = "可以开始学习了\n朗读和识别模型均已在本机就绪，可离线使用。"
                self.timer?.invalidate()
            } else if models["tts"] as? String == "加载失败" || models["asr"] as? String == "加载失败" {
                self.statusLabel.stringValue = "网页已打开，但语音模型加载失败。\n请查看日志，或退出应用后重新打开。"
                self.timer?.invalidate()
            } else {
                self.statusLabel.stringValue = "网页已打开，正在加载本地语音模型…\n首次加载可能需要几十秒。"
            }
        }
    }

    private func fail(_ message: String) {
        statusLabel.stringValue = message
        retryButton.isEnabled = process?.isRunning != true
        openButton.isEnabled = false
    }

    @objc private func openPage() { NSWorkspace.shared.open(pageURL) }
    @objc private func openLog() {
        if FileManager.default.fileExists(atPath: logURL.path) { NSWorkspace.shared.open(logURL) }
    }

    func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
        window.makeKeyAndOrderFront(nil)
        if openButton.isEnabled { openPage() }
        return true
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }

    func applicationWillTerminate(_ notification: Notification) {
        quitting = true
        timer?.invalidate()
        session.invalidateAndCancel()
        if process?.isRunning == true { process?.terminate() }
        try? logHandle?.close()
    }
}

let app = NSApplication.shared
let delegate = LauncherDelegate()
app.delegate = delegate
app.setActivationPolicy(.regular)
app.run()
