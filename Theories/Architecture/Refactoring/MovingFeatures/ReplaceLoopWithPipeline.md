# Replace Loop with Pipeline



<!-- TOC -->

- [Replace Loop with Pipeline](#replace-loop-with-pipeline)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想


## Motivation
1. Like most programmers, I was taught to use loops to iterate over a collection of objects. Increasingly, however, language environments provide a better construct: the collection pipeline. 
2. Collection Pipelines [mf­-cp] allow me to describe my processing as a series of operations, each consuming and emitting a collection. 
3. The most common of these operations are map, which uses a function to transform each element of the input collection, and filter which uses a function to select a subset of the input collection for later steps in the pipeline. 
4. I find logic much easier to follow if it is expressed as a pipeline—I can then read from top to bottom to see how objects flow through the pipeline.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
