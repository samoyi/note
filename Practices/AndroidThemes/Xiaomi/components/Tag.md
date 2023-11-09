



## 形状
### 不全部圆角的矩形
#### 遮罩实现

#### 遮挡实现
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


### 缩放和单位像素
```xml
min(min(#view_width/440,#view_height/440),1)
min(#view_width/440,#view_height/440)
max(#view_width/440,#view_height/440)
```
```xml
<Var name="vwh_s" expression="min(min(#view_width/440,#view_height/440),1)" type="number" />
```


### 图片作为用户选项
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

#### 图片按钮选择深色模式
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