Sniffr.sniff(window.navigator.userAgent);
let osInfo = Sniffr.os;
let url = downloadLinks.exe;
let nameInfo = "Lataa Abitikku";
if (osInfo.name === "linux") {
  url = downloadLinks.app;
  if (window.navigator.userAgent.toLowerCase().includes("ubuntu") || window.navigator.userAgent.toLowerCase().includes("deb"))
    url = downloadLinks.deb,nameInfo += ", Ubuntu/Debian (.deb)";
  else if (window.navigator.userAgent.toLowerCase().includes("arch"))
    url = downloadLinks.rpm,nameInfo += ", Arch (.rpm)";
  else
    nameInfo += ", Linux (.AppImage)";
} else if (osInfo.name === "windows")
  url = downloadLinks.exe,nameInfo += " Windowsille";
else if (osInfo.name === "macos")
  url = downloadLinks.app,nameInfo += " macOS:lle";
let downloadBtn = document.getElementById("download");
downloadBtn.href = url;
downloadBtn.innerHTML = nameInfo;
