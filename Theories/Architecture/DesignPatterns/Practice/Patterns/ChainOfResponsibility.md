# Chain of Responsibility

## 使用场景
1. 和 State 模式有些像，只不过 State 模式的各个状态规定自己要做什么以及做完后要把系统状态切换成什么，并且状态切换没有顺序要求的；而职责链则是某个节点规定自己有什么职责，而且明确的指明自己的后续节点是什么。
2. 和 Template Method 模式的不同是，职责链可以任意安排执行顺序，但 Template Method 模式是明确规定了步骤。
3. 如果某个任务由多个步骤组成，这些步骤必须按照次序执行，但后续这些步骤顺序可能改变，就可以考虑使用该模式。甚至，这只是一类任务，每次具体执行时，都会从步骤池里选取若干步骤来执行，而步骤池里的每个步骤都有明确的顺序依赖关系，更应该考虑这种模板。
4. 总之，关键词是：步骤之间明确顺序依赖，步骤可能发生变动。