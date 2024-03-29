# Lifting State Up


<!-- TOC -->

- [Lifting State Up](#lifting-state-up)
    - [思想](#思想)
    - [举例分析](#举例分析)
    - [与 Vue 的比较](#与-vue-的比较)
        - [子组件变化引发父组件的变化](#子组件变化引发父组件的变化)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 在 React 应用中，任何可变数据应当只有一个相对应的唯一“数据源”。
2. 通常，state 都是首先添加到需要渲染数据的组件中去。然后，如果其他组件也需要这个 state，那么你可以将它提升至这些组件的最近共同父组件中。
3. 你应当依靠自上而下的数据流，而不是尝试在不同组件间同步 state。
4. 虽然提升 state 方式比双向绑定方式需要编写更多的“样板”代码，但带来的好处是，排查和隔离 bug 所需的工作量将会变少。
5. 由于 “存在” 于组件中的任何 state，仅有组件自己能够修改它，因此 bug 的排查范围被大大缩减了。
6. 此外，你也可以使用自定义逻辑来拒绝或转换用户的输入。


## 举例分析
```js
function toCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
}
function toFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

function tryConvert(temperature, convert) {
    const input = parseFloat(temperature);
    if (Number.isNaN(input)) {
        return '';
    }
    const output = convert(input);
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
}

const scaleNames = {
    c: 'Celsius',
    f: 'Fahrenheit'
};


function BoilingVerdict(props) {
    if (props.celsius >= 100) {
        return <p>水会烧开</p>;
    }
    return <p>水不会烧开</p>;
}


class TemperatureInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onTemperatureChange(e.target.value);
    }

    render() {
        const temperature = this.props.temperature;
        const scale = this.props.scale;
        return (
            <fieldset>
                <legend>在{scaleNames[scale]}:中输入温度数值</legend>
                <input value={temperature}
                    onChange={this.handleChange} />
            </fieldset>
        );
    }
}


class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
        this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
        this.state = {temperature: '', scale: 'c'};
    }

    handleCelsiusChange(temperature) {
        this.setState({scale: 'c', temperature});
    }

    handleFahrenheitChange(temperature) {
        this.setState({scale: 'f', temperature});
    }

    render() {
        const scale = this.state.scale;
        const temperature = this.state.temperature;
        const celsius = scale === 'f'
                            ? tryConvert(temperature, toCelsius)
                            : temperature;
        const fahrenheit = scale === 'c'
                            ? tryConvert(temperature, toFahrenheit)
                            : temperature;

        return (
            <div>
                <TemperatureInput
                    scale="c"
                    temperature={celsius}
                    onTemperatureChange={this.handleCelsiusChange} />

                <TemperatureInput
                    scale="f"
                    temperature={fahrenheit}
                    onTemperatureChange={this.handleFahrenheitChange} />

                <BoilingVerdict
                    celsius={parseFloat(celsius)} />
            </div>
        );
    }
}


ReactDOM.render(
    <Calculator />,
    document.getElementById('root')
);
```

1. Calculator 组件包含两个类似的输入框和一个结果框。
2. 两个输入框结构相同，所以使用同一个组件，接收不同的温标作为参数。
3. 输入框作为受控组件，不维护自己的状态，即用户输入的值不保存在组件内部的 `state` 上，而是通过父组件提供的 `onTemperatureChange`反馈给父组件。因此 `value` 也需要由父组件的 `temperature` 来提供。
4. 这里输入框统一使用父组件的状态的原因是：两个输入框之间会共享数据，而且还要把数据提供给同级的结果框。所以输入框的数据应该交由三者共同的父级托管。
5. 虽然两个输入框会记录不同的温标温度，但因为每次都会进行温标转换计算，随意每次只需要在 `state` 中记录一种温标温度就够了。
6. 因为华氏温度和摄氏温度会同步，所以结果框只需要根据摄氏温度来判断即可。


## 与 Vue 的比较
### 子组件变化引发父组件的变化
1. Vue 实现这种功能一般是子组件使用自定义事件（可能带参数）通知父组件，父组件接收自定义事件（并读取参数），然后修改自己的数据。
2. React 则默认是直接把父组件的修改数据的方法传给子组件。
3. Vue 也可以这样做
    ```html
    <div id="app">
        {{ age }}
        <child :method="increment" />
    </div>
    <script>
    "use strict";

    new Vue({
        data: {
            age: 22,
        },
        methods: {
            increment(n){
                this.age += n;
            },
        },
        components: {
            child: {
                template: `<p @click="callParentMethod">child</p>`,
                props: ['method'],
                methods: {
                    callParentMethod(){
                        this.method(3);
                    },
                },
            },
        },
    }).$mount('#app');
    </script>
    ```
4. 各有什么优缺点呢？在 Vue 这样做感觉也挺简单的。


## References
* [状态提升](https://react.docschina.org/docs/lifting-state-up.html)