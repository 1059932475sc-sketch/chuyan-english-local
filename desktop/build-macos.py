"""Build a self-contained app for this Mac using its installed Node runtime."""
import os
import plistlib
import platform
import shutil
import subprocess
from pathlib import Path

project = Path(__file__).resolve().parents[1]
target = project.parent / '初言英语.app'
node = shutil.which('node')
if not node:
    raise SystemExit('Build requires Node.js 22+; installed app does not.')
if target.exists():
    raise SystemExit(f'Build output already exists: {target}. Move it before rebuilding.')
macos = target / 'Contents/MacOS'
resources = target / 'Contents/Resources'
macos.mkdir(parents=True)
resources.mkdir(parents=True)
shutil.copytree(project, resources / 'web', symlinks=True,
                ignore=shutil.ignore_patterns('desktop', '.git', '.DS_Store', 'tests'))
shutil.copy2(node, macos / 'node')
build_cache = project.parent.parent / 'work/desktop-build/module-cache'
build_cache.mkdir(parents=True, exist_ok=True)
subprocess.run(['/usr/bin/swiftc', '-swift-version', '5', '-O', '-target', f'{platform.machine()}-apple-macos14.0', '-module-cache-path', str(build_cache),
                '-framework', 'AppKit', str(project / 'desktop/Launcher.swift'),
                '-o', str(macos / 'FirstSteps')], check=True)
info = {
    'CFBundleName': '初言英语', 'CFBundleDisplayName': '初言英语',
    'CFBundleIdentifier': 'com.firststeps.english.local', 'CFBundleExecutable': 'FirstSteps',
    'CFBundlePackageType': 'APPL', 'CFBundleShortVersionString': '4.0.4', 'CFBundleVersion': '44',
    'LSMinimumSystemVersion': '14.0', 'NSHighResolutionCapable': True,
    'NSHumanReadableCopyright': 'Independent local English learning application. Third-party licenses are included.',
}
with (target / 'Contents/Info.plist').open('wb') as f:
    plistlib.dump(info, f)
(target / 'Contents/PkgInfo').write_text('APPL????')
subprocess.run(['/usr/bin/codesign', '--force', '--deep', '--sign', '-', str(target)], check=True)
subprocess.run(['/usr/bin/codesign', '--verify', '--deep', '--strict', str(target)], check=True)
print(f'Built: {target}')
