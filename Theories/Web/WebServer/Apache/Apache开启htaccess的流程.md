1. Access phpinfo，check if `mod_rewrite` is in `Loaded Modules`
2. If not, modify `httpd.conf` file
	1. 查找 `httpd.conf` ：`httpd -V` 命令，通过 `HTTPD_ROOT` 和 `SERVER_CONFIG_FILE` 找到 `httpd.conf` 文件
	2. 备份原文件：`cp httpd.conf  httpd.conf_bak`
	3. 打开文件：`vi httpd.conf`
	4. 找到 `#LoadModule rewrite_module modules/mod_rewrite.so`
	4. 切换为编辑模式：`i`
	5. 删掉前面的 `#`
	6. 按 Esc 退出编辑模式
	7. 保存并退出：`:wq`
3. 重启Apache：`service httpd restart`