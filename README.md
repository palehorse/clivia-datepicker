## clivia-datepicker
簡易的日期選擇器
## 前置安裝
    jQuery
## 安裝
1.用npm指令安裝
```sh
npm install clivia-datepicker
```
2.用html語法引入
```html
<script src="clivia-datepicker/clivia-datepicker.jquery.js"></script>
```
#### Vue
```javascript
require('clivia-datepickerr/clivia-datepicker.jquery.js');

![image](https://github.com/palehorse/photos/blob/master/clivia-datepicker.png)

```
## 使用方法
#### 初始化
``` javascript
$('#datepicker').datepicker();
```
#### 日期格式
``` javascript
$('#datepicker').datepicker({format: 'yyyy/mm/dd'});
```
## API
#### set
``` javascript
//設定初始日期
$('#datepicker').datepicker('set', '2019-01-01');
```
#### reset
``` javascript
//重設日期
$('#datepicker').datepicker('reset');
```
#### show
``` javascript
//讓日期選擇器出現
$('#datepicker').datepicker('show');
```
#### hide
``` javascript
//隱藏日期選擇器
$('#datepicker').datepicker('hide');
```
