Play Youtube video in KODI

When you open youtube site and push addon button on tollbar then addon send youtube link to KODI (home Theater)

若干处理说明：
1. firefox extension  修改sendtoplug  增加 proxy配置   （proxyprocol有无决定是否传递proxy)
   kodi上的对应插件修改为 plugin.video.sendtokodi
2. youtube-dl download page 时报 ssl err, kodi配置socks with remote dns 后解决

3. youtube-dl download page 时报strptime nonetype问题， 插件中模块youtube_dl 中 utils.py 对所有exception 进行pass不报错

4. 安装kodi出现 obb无法下载 报错（小米上），从KODI官网下载16.1后解决，且17以上版本不支持安装sendtokodi plugin(小米盒子上)

5. 自动启动KODI 可以使用 Launcher for XBMC™  android

6. youtube字幕包括自动生成的，怎么处理加载？ 似乎不能用此API下载自动生成字幕，且由于kodi的request不支持socks代理，暂不处理，代码在 plugin.video.sendtokodi中（service.py.forcaption）
   url: 'https://www.youtube.com/api/timedtext?lang=en&fmt=vtt&name=&v=TImPW-khOww'
 
