
参考这篇文章

1. `cd /usr/src`
2. 从Nodejs官网复制源代码文件链接
3. 下载文件
    ```bash
    wget https://npm.taobao.org/mirrors/node/v8.9.3/node-v8.9.3.tar.gz
    ```
4. 当前目录下有了
    ```bash
    node-v8.9.3.tar.gz
    ```
5. 解压压缩包
    ```bash
    tar zxf node-v8.9.3.tar.gz
    ```
6. 进入解压后的文件夹，执行配置脚本来进行编译预处理
    ```bash
    ./configure
    ```  
7. 显示了如下一段输入
    ```bash
    creating ./icu_config.gypi
    * Using ICU in deps/icu-small
    creating ./icu_config.gypi
    { 'target_defaults': { 'cflags': [],
                           'default_configuration': 'Release',
                           'defines': [],
                           'include_dirs': [],
                           'libraries': []},
      'variables': { 'asan': 0,
                     'coverage': 'false',
                     'debug_devtools': 'node',
                     'debug_http2': 'false',
                     'debug_nghttp2': 'false',
                     'force_dynamic_crt': 0,
                     'gas_version': '2.26',
                     'host_arch': 'ia32',
                     'icu_data_file': 'icudt59l.dat',
                     'icu_data_in': '../../deps/icu-small/source/data/in/icudt59l.da                                            t',
                     'icu_endianness': 'l',
                     'icu_gyp_path': 'tools/icu/icu-generic.gyp',
                     'icu_locales': 'en,root',
                     'icu_path': 'deps/icu-small',
                     'icu_small': 'true',
                     'icu_ver_major': '59',
                     'node_byteorder': 'little',
                     'node_enable_d8': 'false',
                     'node_enable_v8_vtunejit': 'false',
                     'node_install_npm': 'true',
                     'node_module_version': 57,
                     'node_no_browser_globals': 'false',
                     'node_prefix': '/usr/local',
                     'node_release_urlbase': '',
                     'node_shared': 'false',
                     'node_shared_cares': 'false',
                     'node_shared_http_parser': 'false',
                     'node_shared_libuv': 'false',
                     'node_shared_openssl': 'false',
                     'node_shared_zlib': 'false',
                     'node_tag': '',
                     'node_use_bundled_v8': 'true',
                     'node_use_dtrace': 'false',
                     'node_use_etw': 'false',
                     'node_use_lttng': 'false',
                     'node_use_openssl': 'true',
                     'node_use_perfctr': 'false',
                     'node_use_v8_platform': 'true',
                     'node_without_node_options': 'false',
                     'openssl_fips': '',
                     'openssl_no_asm': 0,
                     'shlib_suffix': 'so.57',
                     'target_arch': 'ia32',
                     'uv_parent_path': '/deps/uv/',
                     'uv_use_dtrace': 'false',
                     'v8_enable_gdbjit': 0,
                     'v8_enable_i18n_support': 1,
                     'v8_enable_inspector': 1,
                     'v8_no_strict_aliasing': 1,
                     'v8_optimized_debug': 0,
                     'v8_promise_internal_field_count': 1,
                     'v8_random_seed': 0,
                     'v8_trace_maps': 0,
                     'v8_use_snapshot': 'true',
                     'want_separate_host_toolset': 0}}
    creating ./config.gypi
    creating ./config.mk
    ```
8. 开始编译源代码，耗时近一小时
    ```bash
    make
    ```
9. 编译完成后执行`node -v`提示没有安装。
10. 按照上述文章说的
    > 当编译完成后，我们需要使之在系统范围内可用, 编译后的二进制文件将被放置到系统路
    > 径，默认情况下，Node二进制文件应该放在/user/local/bin/node文件夹下:  

    直接执行以下命令后就可以了：
    ```bash
    make install
    ```
11. 按照文章上说的建立超级链接时出错
    ```bash
    sudo: unable to resolve host iZuf68ip0m748xlwi572g0Z
    ```
跳过这一步
