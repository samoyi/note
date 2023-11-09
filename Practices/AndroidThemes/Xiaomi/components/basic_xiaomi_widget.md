<!-- vscode-markdown-toc -->
* 1. [数学计算](#)
	* 1.1. [小数不透明度转 256 十六进制](#256)
	* 1.2. [直接三角形求斜边](#-1)
* 2. [动画](#-1)
	* 2.1. [指定起终点坐标的移动动画](#-1)
* 3. [文本类组件](#-1)
	* 3.1. [标签](#-1)
	* 3.2. [上下两行文本，尺寸自适应、可选对齐方式](#-1)
* 4. [文本类样式](#-1)
	* 4.1. [单行超出省略号](#-1)
* 5. [交互](#-1)
	* 5.1. [点击触发震动](#-1)
	* 5.2. [配置页拖动滑动条时显示数值并震动](#-1)
* 6. [布局](#-1)
	* 6.1. [横向等间距列表](#-1)
* 7. [形状](#-1)
	* 7.1. [不全部圆角的矩形](#-1)
		* 7.1.1. [遮罩实现](#-1)
		* 7.1.2. [遮挡实现](#-1)
* 8. [时间和日期](#-1)
	* 8.1. [月份和星期字符串](#-1)
	* 8.2. [小时和分钟的四个数位](#-1)
	* 8.3. [获取当前周的日期（从周日开始）](#-1)
	* 8.4. [根据开始和结束的时分值计算持续的小时分钟值](#-1)
	* 8.5. [计算前后节气日的距离天数](#-1)
* 9. [展示数据的组件](#-1)
	* 9.1. [环形进度条](#-1)
	* 9.2. [胶囊形进度条](#-1)
	* 9.3. [圆形背景中居中一张图](#-1)
	* 9.4. [矩形背景中居中一张图](#-1)
* 10. [展示性组件](#-1)
	* 10.1. [整个小部件的边框](#-1)
	* 10.2. [缩放和单位像素](#-1)
	* 10.3. [图片作为用户选项](#-1)
		* 10.3.1. [图片按钮选择深色模式](#-1)
* 11. [事件](#-1)
	* 11.1. [延迟执行](#-1)
* 12. [跳转](#-1)
	* 12.1. [支付宝](#-1)
* 13. [系统调用](#-1)
	* 13.1. [震动](#-1)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


##  1. <a name=''></a>数学计算
###  1.1. <a name='256'></a>小数不透明度转 256 十六进制
```js
Math.round(255*opacity).toString(16)
```

###  1.2. <a name='-1'></a>直接三角形求斜边
```xml
<Var name="hypotenuse" expression="sqrt(pow(#leg1, 2) + pow(#leg2, 2))" />
```


## 数字
### 阿拉伯数字转汉字
```xml
<Var name="number_shuzi_map" type="string[]" expression="''"
    values="'零', '一',, '二',, '三',, '四', '五', '六', '七', '八', '九')"
/>
```


##  2. <a name='-1'></a>动画
###  2.1. <a name='-1'></a>指定起终点坐标的移动动画
```xml
<!-- 终点坐标 -->
<Var name="namespace_aniEndX" expression="" />
<Var name="namespace_aniEndY" expression="" />
<!-- 起点坐标 -->
<Var name="namespace_aniStartX" expression="" />
<Var name="namespace_aniStartY" expression="" />
<!-- X 方向动画 -->
<Var name="namespace_aniSwitchX"
    expression="ifelse(#aniSwitch, #namespace_aniStartX, #namespace_aniEndX)"
/>
<Var name="avatarInAniX">
    <VariableAnimation initPause="true" loop="false">
        <Item value="#namespace_aniSwitchX" time="0" easeType="BackEaseOut" />
        <Item value="#namespace_aniEndX" time="300" />
    </VariableAnimation>
</Var>
<!-- Y 方向动画 -->
<Var name="avatarInAniSwitchY"
    expression="ifelse(#aniSwitch, #namespace_aniStartY, #namespace_aniEndY)"
/>
<Var name="avatarInAniY">
    <VariableAnimation initPause="true" loop="false">
        <Item value="#avatarInAniSwitchY" time="0" easeType="BackEaseOut" />
        <Item value="#namespace_aniEndY" time="300" />
    </VariableAnimation>
</Var>
```


## 多媒体
### 音频
1. 引入音频标签
    ```xml
    <Video name="buttonAudioFrame" layerType="bottom" />
    ```
2. `<ExternalCommands>` 里面加一个独立的 `<Trigger>`，不要写在 `<Trigger action="init,resume">` 里面，`resume` 可能导致问题
    ```xml
    <Trigger action="init">
        <VideoCommand target="buttonAudioFrame" command="config" path="'button.mp3'" />
        <VideoCommand target="buttonAudioFrame" command="setVolume" volume="0.5" />
    </Trigger>
    ```
3. 在事件里触发。注意要开启帧率
    ```xml
    <Trigger action="down" condition="#btnIdx != #pressedBtnIndex">
        <AnimationCommand target="framerateControllerAni" command="play" />
        <MultiCommand condition="#music">
            <VideoCommand target="buttonAudioFrame" command="seekTo" time="0" />
            <VideoCommand target="buttonAudioFrame" command="play" />
        </MultiCommand>
    </Trigger>
    ```
4. 上面的 `#music` 对应配置文件里的开关
    ```xml
    <OnOff name="music" default="0" displayTitle="声音(部分机型支持)" />
    ```
4. 音频文件要放在 `manifest` 同级或者子级。


## 其他系统调用
### 震动
1. 配置文件里设置开关
    ```xml
    <OnOff name="vibrate" default="0" displayTitle="震动" />
    ```
2. 使用
    ```xml
    <Trigger action="down" condition="#btnIdx != #pressedBtnIndex">
        <MultiCommand condition="#vibrate == 1">
            <IntentCommand action="com.miui.intent.action.VIBRATE"
                broadcast="true" />
        </MultiCommand>
    </Trigger>
    ```


##  3. <a name='-1'></a>文本类组件
###  3.1. <a name='-1'></a>标签
1. 示例，矩形里面带文字。支持单行和双行
    <img src="images/tag.png" width="200" style="display: block; margin: 5px 0 10px;" />
    <img src="images/tag1.png" width="200" style="display: block; margin: 5px 0 10px;" />
2. 算 Group 的横坐标时要考虑到圆角部分，该部分不属于 `text_width`.
3. Group 的宽高会自动计算。
4. 实现   TODO，圆角和高度有默认值支持自定义
    ```xml
    <Group
        w="#namespace_recW" h="#namespace_recH"
    >
        <!-- 设置以下值 -->
        <Var name="namespace_isTwoLine" expression="1" /> <!-- 文本是否为双行显示 -->
        <Var name="namespace_textSize" expression="24" />
        <!-- 不能在 monthTag_textExp 里拼接字符串，否则 monthTag_recW 会计算错误 -->
        <Var name="namespace_textExp" type="string" expression="'框内文本'" />
        <Var name="namespace_bgColor" type="string" expression="'#ea4335'" />
        <Var name="namespace_textColor" type="string" expression="'#ffffff'" />

        <!-- 自动计算区域 -->
        <!-- 根据文本的宽度计算矩形宽度 -->
        <!-- 折行时，text_width 仍然是未折行时的宽度，所以要除以 2 -->
        <Var name="namespace_recW"
            expression="ifelse(
                #namespace_isTwoLine, 
                #namespace_textName.text_width/2 + #namespace_textSize*#vwh_s,
                #namespace_textName.text_width + #namespace_textSize*#vwh_s
            )"
        />
        <!-- 矩形区域高度 -->
        <!-- 折行时的 text_height 是折行后的高度 -->
        <Var name="namespace_recH"
            expression="#namespace_textName.text_height+ 20*#vh_s"
        />

        <!-- 文本单行显示时 -->
        <Group
            visibility="#namespace_isTwoLine == 0"
        >
            <Rectangle x="0" y="0"
                w="#namespace_recW"
                h="#namespace_recH"
                fillColor="@namespace_bgColor"
                cornerRadiusExp="#namespace_recH/4"
            />
            <Text name="namespace_textName"
                x="#namespace_recW/2"
                y="#namespace_recH/2"
                align="center" alignV="center"
                color="@namespace_textColor" size="#namespace_textSize*#vwh_s"
                textExp="@namespace_textExp"
            />
        </Group>
        <!-- 文本双行显示时 -->
        <Group
            visibility="#namespace_isTwoLine == 1"
        >
            <Rectangle x="0" y="0"
                w="#namespace_recW"
                h="#namespace_recH"
                fillColor="@namespace_bgColor"
                cornerRadiusExp="#namespace_recH/4"
            />
            <Text name="namespace_textName"
                align="center" alignV="center"
                x="#namespace_recW/2" y="#namespace_recH/2"
                color="@namespace_textColor" size="#namespace_textSize*#vwh_s"
                textExp="@namespace_textExp"
                w="#namespace_textName.text_width/2"
                multiLine="true"
            />
        </Group>
    </Group>
    ```


###  3.2. <a name='-1'></a>上下两行文本，尺寸自适应、可选对齐方式
<img src="images/001.png" width="200" style="display: block; margin: 5px 0 10px;" />

1. Group 宽高会自动计算为刚好容纳两行文字。但字体有可能在文字上下有空白，所以实际的组高度可能会比看到的有效像素高度更高
2. 可设置两行文本的对齐方式，左中右三种。
3. Group 内只需要修改 设置参数区域下面的 7 条变量。另外，Group 坐标需要手动设置。
4. 修改 `namespace` 为文件内唯一的名称。
5. 组件
    ```xml
    <Group
        alignV="bottom"
        x="58*#vw_s" y="#view_height - #bottom_h - 34*#vh_s"
        w="#namespace_groupW" h="#namespace_groupH"
        scale="#vwh_s"
    >
        <!-- 设置参数区域 -->
        <!-- 设置上下两行文本的水平对齐方式 -1为左对齐，0为居中对齐，1为右对齐-->
        <Var name="namespace_alignType" expression="-1" />
        <!-- 设这两行文本 size -->
        <Var name="namespace_upperLineFontSize" expression="76" />
        <Var name="namespace_lowerLineFontSize" expression="24" />
        <!-- 设这两行文本颜色 -->
        <Var name="namespace_upperLineColor" type="string" expression="@dateColor" />
        <Var name="namespace_lowerLineColor" type="string" expression="'#6c7e97'" />
        <!-- 设这两行文本内容 -->
        <Var name="namespace_upperLineText" type="string" expression="'第一行文字'"
        />
        <Var name="namespace_lowerLineText" type="string" expression="'第二行文字'"
        />

        <!-- 是否调试 -->
        <!-- 尺寸和位置不准确时开启调试，会显示和 Group 同尺寸同位置的颜色矩形 -->
        <Var name="namespace_isDebug" expression="0" />
        <Var name="namespace_debugBgc" type="string" expression="'#57c593'" />

        <!-- 自动计算区域 -->
        <Var name="namespace_groupH"
            expression="#namespace_upperLine.text_height + #namespace_lowerLine.text_height"
        />
        <Var name="namespace_upperLineW" expression="#namespace_upperLine.text_width" />
        <Var name="namespace_lowerLineW" expression="#namespace_lowerLine.text_width" />
        <Var name="namespace_groupW"
            expression="max(#namespace_upperLineW, #namespace_lowerLineW)"
        />

        <!-- Group 背景色，调试时使用 -->
        <Rectangle
            x="0" y="0"
            w="#namespace_groupW" h="#namespace_groupH"
            fillColor="@namespace_debugBgc"
            visibility="#namespace_isDebug"
        >
        </Rectangle>

        <!-- 左对齐的两行文本 -->
        <!-- TODO size 不受 Group 缩放的影响？或者影响不大？这里 加上 #vwh_s 才合适的 -->
        <Text align="left" x="0"
            name="namespace_upperLine" y="0"
            color="@namespace_upperLineColor"
            size="#namespace_upperLineFontSize*#vwh_s"
            textExp="@namespace_upperLineText"
            visibility="#namespace_alignType == -1"
        />
        <Text align="left" x="0"
            name="namespace_lowerLine"
            alignV="bottom" y="#namespace_groupH"
            color="@namespace_lowerLineColor"
            size="#namespace_lowerLineFontSize"
            textExp="@namespace_lowerLineText"
            visibility="#namespace_alignType == -1"
        />

        <!-- 居中对齐的两行文本 -->
        <!-- TODO size 不受 Group 缩放的影响？或者影响不大？这里 加上 #vwh_s 才合适的 -->
        <Text align="center" x="#namespace_groupW/2"
            name="namespace_upperLine" y="0"
            color="@namespace_upperLineColor"
            size="#namespace_upperLineFontSize*#vwh_s"
            textExp="@namespace_upperLineText"
            visibility="#namespace_alignType == 0"
        />
        <Text align="center" x="#namespace_groupW/2"
            name="namespace_lowerLine"
            alignV="bottom" y="#namespace_groupH"
            color="@namespace_lowerLineColor"
            size="#namespace_lowerLineFontSize"
            textExp="@namespace_lowerLineText"
            visibility="#namespace_alignType == 0"
        />

        <!-- 右对齐的两行文本 -->
        <!-- TODO size 不受 Group 缩放的影响？或者影响不大？这里 加上 #vwh_s 才合适的 -->
        <Text align="right" x="#namespace_groupW"
            name="namespace_upperLine" y="0"
            color="@namespace_upperLineColor"
            size="#namespace_upperLineFontSize*#vwh_s"
            textExp="@namespace_upperLineText"
            visibility="#namespace_alignType == 1"
        />
        <Text align="right" x="#namespace_groupW"
            name="namespace_lowerLine"
            alignV="bottom" y="#namespace_groupH"
            color="@namespace_lowerLineColor"
            size="#namespace_lowerLineFontSize"
            textExp="@namespace_lowerLineText"
            visibility="#namespace_alignType == 1"
        />
    </Group>
    ```


##  4. <a name='-1'></a>文本类样式
###  4.1. <a name='-1'></a>单行超出省略号
```xml
<Text textExp="ifelse( len(@str) } 3, substr(@str, 0, 3) + '...', @str)" />
```


##  5. <a name='-1'></a>交互
###  5.1. <a name='-1'></a>点击触发震动
只能是在点击的 trigger 里面调用，在动画结束后面的 trigger 里再调用无效
```xml
<IntentCommand action="com.miui.intent.action.VIBRATE" broadcast="true">
    <Extra name="linear_effect" type="int" expression="2" />
    <Extra name="vibrate_milli" type="long" expression="22" />
</IntentCommand>
```

###  5.2. <a name='-1'></a>配置页拖动滑动条时显示数值并震动
```xml
<!-- 
    配置页拖动滑动条时显示数值并震动（圆角和透明度滑动条）
-->
<!-- 圆角 1 像素对应滑动条一个单位，透明度 alpha 一单位对应滑动条一单位 
        圆角改变两个像素时、或者透明度 alpha 值改变 4 单位时，触发一次震动
        因为设置透明度显示为百分比，1% 相当于 alpha 2.25，所以透明度也是显示变化 2% 时震动一次，
        和圆角变化两个像素变化一次保持相同频率。
-->
<Var expression="#radiusConfig/2+#alphaConfig/40" threshold="1">
    <Trigger>
        <AnimationCommand target="isSetting" command="play" condition="#isSetting==0" />
        <AnimationCommand target="timingAni" command="play" />
        <IntentCommand action="com.miui.intent.action.VIBRATE" broadcast="true">
            <Extra name="linear_effect" type="int" expression="2" />
            <Extra name="vibrate_milli" type="long" expression="22" />
        </IntentCommand>
    </Trigger>
</Var>
<!--  tipsType 标记正在设置什么。设置圆角时，tipsType 为 0；设置时透明度，tipsType 为 1 -->
<Var expression="#radiusConfig" threshold="1">
    <Trigger>
        <VariableCommand name="tipsType" expression="0" type="number" />
    </Trigger>
</Var>
<Var expression="#alphaConfig" threshold="1">
    <Trigger>
        <VariableCommand name="tipsType" expression="1" type="number" />
    </Trigger>
</Var>
<!-- 延迟变量，动画结束后切换为非设置状态。动画结束前如果再次调节，则动画重新计时 -->
<Var name="timingAni">
    <VariableAnimation name="timing_Ani" loop="false" initPause="true">
        <AniFrame value="0" time="0" />
        <AniFrame value="1" time="1200" />
        <Triggers>
            <Trigger action="end" condition="#timing_Ani.current_frame == -1">
                <AnimationCommand target="isSetting" command="play" condition="#isSetting==1" />
            </Trigger>
        </Triggers>
    </VariableAnimation>
</Var>
<!-- 翻转是否正在设置 -->
<Var name="isSetting">
    <VariableAnimation initPause="true" loop="false">
        <Item value="#isSetting" time="0" easeType="SineEaseOut" />
        <Item value="!#isSetting" time="200" />
    </VariableAnimation>
</Var>
<!-- 显示设置数值 -->
<Group align="center" x="int(#view_width/2)" y="(#isSetting-1)*88+30"
    w="340" h="88"
    alpha="#isSetting*255" visibility="eqs(@isPreviewMode,'true')"
>
    <Rectangle align="center" x="170" y="0"
        w="340" h="88" cornerRadius="44"
        fillColor="#ffffff"
        strokeColor="#33000000" weight="2" strokeAlign="center" 
    />
    <!-- 透明度数值显示为百分比，圆角数值一比一显示 -->
    <Text align="center" x="170" y="20"
        size="36" fontFamily="mipro-medium" color="#000000"
        textExp="ifelse(
            #tipsType, 
            '透明度: ' + round((#alphaConfig-1)/2.55)+'%',
            '圆角大小: ' + int(#radiusConfig-1)+'px'
        )"
    />
</Group>
```


##  6. <a name='-1'></a>布局
###  6.1. <a name='-1'></a>横向等间距列表
1. 参考 “色域” 小部件节气日历。
2. 横向列表，每个列表项等宽等间距。
3. 重命名 `namespace` 
    ```xml
    <Group name="namespace_space_between"
        w="#namespace_group_width" h="#namespace_item_height"
        x="#namespace_hor_margin" y="47*#vh_s"
    >
        <!-- 设定横向列表水平外边距 -->
        <Var name="namespace_hor_margin" expression="56*#vw_s" />
        <!-- 设定列表项宽度 -->
        <Var name="namespace_item_width" expression="77*#vw_s" />
        <!-- 设定整个列表项宽度 -->
        <Var name="namespace_group_width" expression="#view_width - #namespace_hor_margin*2" />
        <!-- 设定列表项数量 -->
		<Var name="namespace_item_count" expression="7" />
        <!-- 设定列表项高度。这一项不用作响应式计算，只是方便复用 -->
        <Var name="namespace_item_height" expression="105*#vh_s" />

        <!-- 自动计算列表项间距 -->
        <Var name="namespace_space"
            expression="(#namespace_group_width - #namespace_item_width*#namespace_item_count) / (#namespace_item_count-1)"
        />

        <!-- count 不能用变量 -->
        <Array count="3" indexName="idx">
            <!-- 这里把每个列表项作为要给 Group，根据情况也可以不用 -->
            <!-- 每个列项的横坐标会根据上面设定自动计算 -->
            <Group
                x="#idx*(#namespace_item_width+#namespace_space)" y="0"
                w="#namespace_item_width" h="#namespace_item_height"
            >
                <!-- 两种颜色的矩形 -->
                <Var name="namespace_fillColor" type="string"
                    expression="ifelse(#idx==1, '#ffba41', '#ffffff')"
                />
                <Rectangle
                    x="0" y="0"
                    w="#namespace_item_width" h="#namespace_item_height"
                    fillColor="@namespace_fillColor"
                    cornerRadiusExp="#38*#vw_s"
                />
                <!-- <Text> 的 color 无法使用 index，
                    所以写两种 color 的 <Text>，根据 idx 设置 alpha 
                -->
                <Text x="#namespace_item_width/2" y="#namespace_item_height/2"
                    align="center" alignV="center"
                    color="#000000" bold="true"
                    size="30*#vwh_s" w="30*#vwh_s" multiLine="true" spacingMult="0.8"
                    textExp="formatDate('t',#time_sys-#countDaysBeforeBefore*86400000)"
                    alpha="(#idx%2==0)*255"
                />
                <Text x="#namespace_item_width/2" y="#namespace_item_height/2"
                    align="center" alignV="center"
                    color="#ffffff" bold="true"
                    size="30*#vwh_s" w="30*#vwh_s" multiLine="true" spacingMult="0.8"
                    textExp="formatDate('t',#time_sys-#countDaysBeforeBefore*86400000)"
                    alpha="(#idx%2)*255"
                />
            </Group>
        </Array>	
    </Group>
    ```




##  7. <a name='-1'></a>形状
###  7.1. <a name='-1'></a>不全部圆角的矩形

####  7.1.1. <a name='-1'></a>遮罩实现

####  7.1.2. <a name='-1'></a>遮挡实现
1. 哪个角不需要圆角就覆盖一个超过其圆角半径的矩形。
2. 下面以左上角不需要圆角为例
    ```xml
    <!-- 正常的圆角矩形 -->
    <Rectangle w="#view_width" h="#bottom_h"
        align="right" alignV="bottom"
        x="#view_width" y="#bottom_h"
        fillColor="#4374fc"
        cornerRadiusExp="#radiusConfig-2"
    />
    <!-- 遮挡左上角圆角，变成直角 -->
    <Rectangle w="#radiusConfig*2" h="#radiusConfig*2"
        x="0" y="0"
        fillColor="#4374fc"
    />
    ```


##  8. <a name='-1'></a>时间和日期
###  8.1. <a name='-1'></a>月份和星期字符串
```xml
<Var name="en_month_abbr_upper_map" type="string"
    expression="ifelse(
        (#month == 0), 'JAN',
        (#month == 1), 'FEB',
        (#month == 2), 'MAR',
        (#month == 3), 'APR',
        (#month == 4), 'MAY',
        (#month == 5), 'JUN',
        (#month == 6), 'JUL',
        (#month == 7), 'AUG',
        (#month == 8), 'SEP',
        (#month == 9), 'OCT',
        (#month == 10), 'NOV',
        'DEC'
    )"
/>
```
```xml
<Var name="en_month_abbr_cap_map" type="string"
    expression="ifelse(
        (#month == 0), 'Jan',
        (#month == 1), 'Feb',
        (#month == 2), 'Mar',
        (#month == 3), 'Apr',
        (#month == 4), 'May',
        (#month == 5), 'Jun',
        (#month == 6), 'Jul',
        (#month == 7), 'Aug',
        (#month == 8), 'Sep',
        (#month == 9), 'Oct',
        (#month == 10), 'Nov',
        'Dec'
    )"
/>
```
```xml
<Var name="lunar_month_map" type="string"
    expression="ifelse(
        (#month == 0), '一月',
        (#month == 1), '二月',
        (#month == 2), '三月',
        (#month == 3), '四月',
        (#month == 4), '五月',
        (#month == 5), '六月',
        (#month == 6), '七月',
        (#month == 7), '八月',
        (#month == 8), '九月',
        (#month == 9), '十月',
        (#month == 10), '十一月',
         '十二月'
    )"
/>
```
```xml
<Var name="cn_week_zhou_map" type="string"
    expression="ifelse(
        (#day_of_week == 1), '周日',
        (#day_of_week == 2), '周一',
        (#day_of_week == 3), '周二',
        (#day_of_week == 4), '周三',
        (#day_of_week == 5), '周四',
        (#day_of_week == 6), '周五',
        '周六'
    )"
/>
```
```xml
<Var name="cn_week_xingqi_map" type="string"
    expression="ifelse(
        (#day_of_week == 1), '星期日',
        (#day_of_week == 2), '星期一',
        (#day_of_week == 3), '星期二',
        (#day_of_week == 4), '星期三',
        (#day_of_week == 5), '星期四',
        (#day_of_week == 6), '星期五',
        '星期六'
    )"
/>
```
```xml
<Var name="en_week_upper_map" type="string"
    expression="ifelse(
        (#day_of_week == 1), 'SUNDAY',
        (#day_of_week == 2), 'MONDAY',
        (#day_of_week == 3), 'TUESDAY',
        (#day_of_week == 4), 'WEDNESDAY',
        (#day_of_week == 5), 'THURSDAY',
        (#day_of_week == 6), 'FRIDAY',
        'SATURDAY'
    )"
/>
```
```xml
<Var name="en_week_cap_map" type="string"
    expression="ifelse(
        (#day_of_week == 1), 'Sunday',
        (#day_of_week == 2), 'Monday',
        (#day_of_week == 3), 'Tuesday',
        (#day_of_week == 4), 'Wednesday',
        (#day_of_week == 5), 'Thursday',
        (#day_of_week == 6), 'Friday',
        'Saturday'
    )"
/>
```
```xml
<Var name="en_week_short_upper_map" type="string"
    expression="ifelse(
        (#day_of_week == 1), 'SUN',
        (#day_of_week == 2), 'MON',
        (#day_of_week == 3), 'TUE',
        (#day_of_week == 4), 'WED',
        (#day_of_week == 5), 'THU',
        (#day_of_week == 6), 'FRI',
        'SAT'
    )"
/>
```
```xml
<Var name="cn_week_zhou" type="string[]" const="true"
    values="'周日','周一','周二','周三','周四','周五','周六'" />
```
```xml
<Var name="en_week_short_upper" type="string[]" const="true" expression="''"
    values="'SUN','MON','TUE','WED','THU','FRI', 'SAT'"
/>
```
```xml
<Var name="en_week_short_cap_map" type="string"
    expression="ifelse(
        (#day_of_week == 1), 'Sun',
        (#day_of_week == 2), 'Mon',
        (#day_of_week == 3), 'Tue',
        (#day_of_week == 4), 'Wed',
        (#day_of_week == 5), 'Thu',
        (#day_of_week == 6), 'Fri',
        'Sat'
    )"
/>
```

###  8.2. <a name='-1'></a>小时和分钟的四个数位
TODO #hour12 为什么会等于 0？从下面的逻辑看，等于 0 时时
```xml
<Var name="t_h1"
    expression="ifelse(
        #time_format, 
        ifelse(#hour24{10, 0, digit(#hour24,2)),
        ifelse(#hour12==0, 1, ifelse(#hour12{10, 0, 1))
    )" 
/>
<Var name="t_h2"
    expression="ifelse(
        #time_format, 
        digit(#hour24, 1),
        ifelse(#hour12==0, 2, digit(#hour12, 1))
    )"
/>

<Var name="t_m1" expression="ifelse(#minute{10, 0, digit(#minute,2))" />
<Var name="t_m2" expression="digit(#minute, 1)" />
```

###  8.3. <a name='-1'></a>获取当前周的日期（从周日开始）
计算但前周周日的时间戳，然后循环加 86400000 毫秒获得每一天的时间戳，并格式化为日期
```xml
<Var name="currSunDayTimestamp" expression="(#time_sys - (#day_of_week - 1) * 86400000)" />
```

###  8.4. <a name='-1'></a>根据开始和结束的时分值计算持续的小时分钟值
例如设定入睡时间 22:50，起床时间是 7:30，则会根据 `#clock_sleep_hour`（22）, `#clock_wake_hour`（7）`#clock_sleep_minute`（50）, `#clock_wake_minute`（30）计算出睡眠的小时数分钟数的格式化字符串 `sleepTime`
```xml
<Var name="sleepHours"
    expression="ifelse(
    #clock_wake_hour }= #clock_sleep_hour, #clock_wake_hour - #clock_sleep_hour,
    24 - #clock_sleep_hour + #clock_wake_hour
    )"
/>
<Var name="sleepMinutes"
    expression="ifelse(
    #clock_wake_minute }= #clock_sleep_minute, #clock_wake_minute - #clock_sleep_minute,
    60 - #clock_sleep_minute + #clock_wake_minute
    )"
/>
<!-- 起床分钟数小于入睡分钟数时需要从小时借一位 -->
<Var name="sleepHoursMinusOne" expression="#sleepHours - 1" />
<Var name="sleepTime" type="string"
    expression="ifelse(
    #clock_wake_minute }= #clock_sleep_minute, #sleepHours +'h'+ #sleepMinutes +'m',
    #sleepHoursMinusOne +'h'+ #sleepMinutes +'m'
    )"
/>
```

###  8.5. <a name='-1'></a>计算前后节气日的距离天数
```xml
<!-- 确定距离前后节气日的天数 
    包括下一个节气日，前一个节气日和前前一个节气日
    因为前一个节气日就是当前所在15天的那个节气，所以如果要显示三个节气日还要计算前前一个的
-->
<Function name="solarTermCountDays">
    <VariableCommand name="solarTermsBefore" expression="''" type="string" />
    <VariableCommand name="solarTermsAfter" expression="''" type="string" />

    <!-- 向后遍历四十天，找到之前的节气日，B 标记节气日 -->
    <LoopCommand count="40" indexName="_i">
        <VariableCommand name="solarTermsBefore"
            expression="@solarTermsBefore+ifelse(
            strIsEmpty(formatDate('t',#time_sys-#_i*86400000)),'A','B')"
            type="string" />
    </LoopCommand>
    <!-- 向后遍历二十天，找到下一个节气日的那两天，B 标记节气日 -->
    <LoopCommand count="20" indexName="_i">
        <VariableCommand name="solarTermsAfter"
            expression="@solarTermsAfter+ifelse(strIsEmpty(formatDate('t',#time_sys+#_i*86400000)),'A','B')"
            type="string" />
    </LoopCommand>

    <!-- 找到距离前后最近的一个节气的天数（不包括前前一个） -->
    <VariableCommand name="countDaysBefore"
        expression="strIndexOf(@solarTermsBefore,'B')"
        type="number" />
    <VariableCommand name="countDaysAfter" expression="strIndexOf(@solarTermsAfter,'B')"
        type="number" />

    <IfCommand ifCondition="#countDaysAfter==0">
        <Consequent>
             <!-- 如果当天就是节气日，那 solarTermsAfter 序列里第一项是 B，
                之后还会有第二个 B，需要找到第二个 
            -->
            <VariableCommand name="solarTermsAfter"
                expression="strReplaceFirst(@solarTermsAfter,'B','X')" type="string" />
            <VariableCommand name="countDaysAfter"
                expression="strIndexOf(@solarTermsAfter,'B')"
                type="number" />
        </Consequent>
        <Alternate>
            <VariableCommand name="countDaysAfter"
                expression="strIndexOf(@solarTermsAfter,'B')"
                type="number" />
        </Alternate>
    </IfCommand>

    <!-- 获得前前一个节气日的距离天数 -->
    <VariableCommand name="solarTermsBefore"
        expression="strReplaceFirst(@solarTermsBefore,'B','X')" type="string" />
    <VariableCommand name="countDaysBeforeBefore"
        expression="strIndexOf(@solarTermsBefore,'B')"
        type="number" />
</Function>

<!-- 文本输出 -->
<Text x="20" y="20" color="#000000" size="30"
    textExp="ifelse(
        len(formatDate('t',#time_sys)),'今日&#10;'+formatDate('t',#time_sys),
        '已过&#10;'+formatDate('t',#time_sys-#countDaysBefore*86400000))" 
    />
<Text x="20" y="50" color="#000000" size="30"
    textExp="'距离'+formatDate('t',#time_sys+#countDaysAfter*86400000)+'还有'+#countDaysAfter+'天'" />
```


##  9. <a name='-1'></a>展示数据的组件
###  9.1. <a name='-1'></a>环形进度条
<img src="images/002.png" width="200" style="display: block; margin: 5px 0 10px;" />

```xml
<Group name="namespace_circleProgress">
    <!-- 设定区域 -->
    <!-- 环形中心坐标和半径 -->
    <Var name="namespace_x" expression="#data_item_width/2" />
    <Var name="namespace_y" expression="#data_item_height/2" />
    <Var name="namespace_r" expression="49" />
    <!-- 背景环和前景环的颜色 -->
    <Var name="namespace_backColor" type="string" expression="'#57c593'" />
    <Var name="namespace_upColor" type="string" expression="'#ffe431'" />
    <!-- 背景环和前景环的粗细 -->
    <Var name="namespace_backWeight" expression="8" />
    <Var name="namespace_upWeight" expression="12" />
    <!-- 开始的角度 -->
    <Var name="namespace_startAngle" expression="-90" />
    <!-- 进度值。范围是 0~100 -->
    <Var name="namespace_sweep" expression="50" />

    <Circle r="#namespace_r"
        x="#namespace_x" y="#namespace_y"
        strokeColor="@namespace_backColor"
        weight="#namespace_backWeight" cap="round" strokeAlign="center"
    >
    </Circle>
    <Arc x="#namespace_x" y="#namespace_x"
        w="#namespace_r*2" h="#namespace_r*2"
        startAngle="#namespace_startAngle" sweep="#namespace_sweep/100*360"
        strokeColor="@namespace_upColor" weight="#namespace_upWeight"
        cap="round"
        strokeAlign="center"
    >
    </Arc>
</Group>
```

###  9.2. <a name='-1'></a>胶囊形进度条
<img src="images/004.png" width="200" style="display: block; margin: 5px 0 10px;" />
代码中不包含中间的图标图片

```xml
<Group>
    <!-- 矩形宽高和圆角值 -->
    <Var name="namespace_w" expression="#batteryIconWidth" />
    <Var name="namespace_h" expression="#batteryIconHeight" />
    <Var name="namespace_radius" expression="30" />
    <!-- 矩形填充色 -->
    <Var name="namespace_backColor" type="string" expression="'#57c593'" />
    <Var name="namespace_upColor" type="string" expression="'#ffe431'" />
    <!-- 进度值。范围是 0~100 -->
    <Var name="namespace_progress" expression="50" />

    <Rectangle
        x="0" y="0"
        w="#namespace_w" h="#namespace_h"
        cornerRadiusExp="#namespace_radius"
        fillColor="@namespace_backColor"
    >
    </Rectangle>
    <Rectangle alignV="bottom"
        x="0" y="#namespace_h"
        w="#namespace_w" h="#namespace_h * #namespace_progress / 100"
        xfermode="src_atop"
        fillColor="@namespace_upColor"
    >
    </Rectangle>
</Group>
```

###  9.3. <a name='-1'></a>圆形背景中居中一张图
<img src="images/003.png" width="200" style="display: block; margin: 5px 0 10px;" />

```xml
<Group name="imageInCircle">
    <!-- 设定区域 -->
    <!-- 圆形中心坐标和半径 -->
    <Var name="namespace_x" expression="#data_item_width/2" />
    <Var name="namespace_y" expression="#data_item_height/2" />
    <Var name="namespace_r" expression="49" />
    <!-- 圆形颜色 -->
    <Var name="namespace_color" type="string" expression="'#4d000000'" />
    <!-- 图片路径 -->
    <Var name="namespace_imgSrc" type="string" expression="'img/2.png'" />
    
    <Circle x="#namespace_x" y="#namespace_y" r="#namespace_r"
        fillColor="@namespace_color"
    >
    </Circle>
    <Image align="center" alignV="center"
        x="#namespace_x" y="#namespace_y"
        src="@namespace_imgSrc"
    />
</Group>
```

###  9.4. <a name='-1'></a>矩形背景中居中一张图
```xml
<Group
    w="#namespace_w" h="#namespace_h"
>
    <!-- 设定区域 -->
    <!-- 矩形宽高和圆角值 -->
    <Var name="namespace_w" expression="#batteryIconWidth" />
    <Var name="namespace_h" expression="#batteryIconHeight" />
    <Var name="namespace_radius" expression="30" />
    <!-- 矩形填充色 -->
    <Var name="namespace_color" type="string" expression="'#ffe431'" />
    <!-- 图片路径 -->
    <Var name="namespace_imgSrc" type="string" expression="'img/1.png'" />

    <Rectangle
        w="#namespace_w" h="#namespace_h"
        cornerRadiusExp="#namespace_radius"
        fillColor="@namespace_color"
    >
    </Rectangle>
    <Image align="center" alignV="center"
        x="#namespace_w/2" y="#namespace_h/2"
        src="@namespace_imgSrc"
    />
</Group>
```

##  10. <a name='-1'></a>展示性组件
###  10.1. <a name='-1'></a>整个小部件的边框
```xml
<!-- 整个小部件的边框 -->
<!-- 这里的圆角值要更小一些，否则会露出后面 -->
<Var name="borderSwitch" expression="1" type="number" const="true" />

<Rectangle x="0" y="0"
    w="#view_width" h="#view_height"
    strokeColor="ifelse(#darkMode,'#696969' ,'#000000')" weight="4"
    strokeAlign="inner"
    cornerRadiusExp="#radiusConfig-4"
    visibility="#borderSwitch"
>
</Rectangle>
```
```xml
<!-- config 中的配置 -->
<OnOff name="borderSwitch" default="1" displayTitle="显示边框" />
```

###  10.2. <a name='-1'></a>缩放和单位像素
```xml
min(min(#view_width/440,#view_height/440),1)
min(#view_width/440,#view_height/440)
max(#view_width/440,#view_height/440)
```
```xml
<Var name="vwh_s" expression="min(min(#view_width/440,#view_height/440),1)" type="number" />
```


###  10.3. <a name='-1'></a>图片作为用户选项
1. 使用自定义图片位的功能，用户选择一个图片，获取到所选的图片后，提取图片名中可以作为 ID 的部分，使用该 ID。
2. 在 var_config.xml 中设置若干图片作为选项
    ```xml
    <ImageSelect name="surfaceConfig" displayTitle="外观" width="300" height="150">
		<item>config/surface_2.png</item>
		<item>config/surface_0.png</item>
		<item>config/surface_1.png</item>
	</ImageSelect>
    ```
3. 在 manifext.xml 中获取用户选择的图片名
    ```xml
    <Var name="surfaceConfig" expression="'config/surface_2.png'" type="string" const="true" />
    ```
4. 提取图片名中的 ID
    ```xml
	<Var name="surfaceVar" expression="strReplaceAll(strReplaceAll(@surfaceConfig,'config/surface_',''),'.png','')" type="number" />
    ```

####  10.3.1. <a name='-1'></a>图片按钮选择深色模式
1. 图片 0 1 2 分别是 浅色 深色 跟随系统
2. var_config.xml
    ```xml
    <ImageSelect name="surfaceConfig" displayTitle="外观" width="300" height="150">
		<item>config/surface_2.png</item>
		<item>config/surface_0.png</item>
		<item>config/surface_1.png</item>
	</ImageSelect>
    ``` 
3. manifext.xml 获取选择的图片 ID 并确定是否深色模式
    ```xml
    <Var name="surfaceConfig" expression="'config/surface_2.png'" type="string" const="true" />
    <Var name="surfaceVar" expression="strReplaceAll(strReplaceAll(@surfaceConfig,'config/surface_',''),'.png','')" type="number" />
    <Var name="darkMode" expression="ifelse(#surfaceVar==2,#__darkmode,#surfaceVar)" type="number" />
    ```


##  11. <a name='-1'></a>事件
###  11.1. <a name='-1'></a>延迟执行
```xml
<Var name="timingAni">
    <VariableAnimation name="timing_Ani" loop="false" initPause="true">
        <AniFrame value="0" time="0" />
        <AniFrame value="1" time="1200" />
        <Triggers>
            <Trigger action="end" condition="#timing_Ani.current_frame == -1">
                <!-- 需要延迟执行的命令 -->
            </Trigger>
        </Triggers>
    </VariableAnimation>
</Var>
```


##  12. <a name='-1'></a>跳转
###  12.1. <a name='-1'></a>支付宝
* 首页
    ```xml
    <IntentCommand action="android.intent.action.MAIN" 
        package="com.eg.android.AlipayGphone"
        class="com.eg.android.AlipayGphone.AlipayLogin" 
    />
    ```
* 扫一扫
    ```xml
    <IntentCommand action="android.intent.action.MAIN" 
        package="com.eg.android.AlipayGphone"
		class="com.alipay.mobile.scan.as.main.MainCaptureActivity" 
    />
    ```
* 付款码？
    ```xml
    <IntentCommand action="android.intent.action.MAIN" 
        package="com.eg.android.AlipayGphone"
		class="com.eg.android.AlipayGphone.FastStartActivity" 
    />
    ```
* 导航？
    ```xml
    <IntentCommand action="android.intent.action.VIEW"
		uri="alipayqr://platformapi/startapp?saId=200011235" 
    />
    ```


##  13. <a name='-1'></a>系统调用
###  13.1. <a name='-1'></a>震动
部分机型支持
```xml
<IntentCommand action="com.miui.intent.action.VIBRATE" broadcast="true">
    <Extra name="linear_effect" type="int" expression="2" />
    <Extra name="vibrate_milli" type="long" expression="22" />
</IntentCommand>
```
