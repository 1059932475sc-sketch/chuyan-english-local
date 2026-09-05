import Foundation

// A Finder bookmark file works without a filesystem symlink.
let target = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
let destination = URL(fileURLWithPath: CommandLine.arguments[2])
guard !FileManager.default.fileExists(atPath: destination.path) else {
    fatalError("The desktop item already exists; it was not replaced.")
}
let bookmark = try target.bookmarkData(options: .suitableForBookmarkFile,
                                      includingResourceValuesForKeys: nil, relativeTo: nil)
try URL.writeBookmarkData(bookmark, to: destination)
print("Created Finder alias: \(destination.path)")
