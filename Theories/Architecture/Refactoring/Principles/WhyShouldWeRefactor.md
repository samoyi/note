# Why Should We Refactor


<!-- TOC -->

- [Why Should We Refactor](#why-should-we-refactor)
    - [思想](#思想)
    - [Refactoring Improves the Design of Software](#refactoring-improves-the-design-of-software)
    - [Refactoring Makes Software Easier to Understand](#refactoring-makes-software-easier-to-understand)
    - [Refactoring Helps Me Find Bugs](#refactoring-helps-me-find-bugs)
    - [Refactoring Helps Me Program Faster](#refactoring-helps-me-program-faster)
    - [References](#references)

<!-- /TOC -->


## 思想


## Refactoring Improves the Design of Software
1. Without refactoring, the internal design — the architecture — of software tends to decay. 
2. As people change code to achieve short­term goals, often without a full comprehension of the architecture, the code loses its structure. It becomes harder for me to see the design by reading the code. 
3. Loss of the structure of code has a cumulative effect. The harder it is to see the design in the code, the harder it is for me to preserve it, and the more rapidly it decays. 
4. Regular refactoring helps keep the code in shape. 
5. Poorly designed code usually takes more code to do the same things, often because the code quite literally does the same thing in several places. Thus an important aspect of improving design is to eliminate duplicated code. 
6. It’s not that reducing the amount of code will make the system run any faster — the effect on the footprint of the programs rarely is significant. 
7. Reducing the amount of code does, however, make a big difference in modification of the code. The more code there is, the harder it is to modify correctly. There’s more code for me to understand. I change this bit of code here, but the system doesn’t do what I expect because I didn’t change that bit over there that does much the same thing in a slightly different context. 
8. By eliminating duplication, I ensure that the code says everything once and only once, which is the essence of good design.

## Refactoring Makes Software Easier to Understand 
1. Programming is in many ways a conversation with a computer. I write code that tells the computer what to do, and it responds by doing exactly what I tell it. 
2. In time, I close the gap between what I want it to do and what I tell it to do. Programming is all about saying exactly what I want. 
3. But there are likely to be other users of my source code. In a few months, a human will try to read my code to make some changes. That user, who we often forget, is actually the most important. 
4. Who cares if the computer takes a few more cycles to compile something? Yet it does matter if it takes a programmer a week to make a change that would have taken only an hour with proper understanding of my code. 
5. The trouble is that when I’m trying to get the program to work, I’m not thinking about that future developer. It takes a change of rhythm to make the code easier to understand.
6. Refactoring helps me make my code more readable. Before refactoring, I have code that works but is not ideally structured. A little time spent on refactoring can make the code better communicate its purpose — say more clearly what I want. 
7. I’m not necessarily being altruistic about this. Often, this future developer is myself. This makes refactoring even more important. 
8. I’m a very lazy programmer. One of my forms of laziness is that I never remember things about the code I write. Indeed, I deliberately try not remember anything I can look up, because I’m afraid my brain will get full. 
9. I make a point of trying to put everything I should remember into the code so I don’t have to remember it.


## Refactoring Helps Me Find Bugs 
1. Help in understanding the code also means help in spotting bugs. 
2. I admit I’m not terribly good at finding bugs. Some people can read a lump of code and see bugs; I cannot. 
3. However, I find that if I refactor code, I work deeply on understanding what the code does, and I put that new understanding right back into the code. 
4. By clarifying the structure of the program, I clarify certain assumptions I’ve made — to a point where even I can’t avoid spotting the bugs. 
5. It reminds me of a statement Kent Beck often makes about himself: “I’m not a great programmer; I’m just a good programmer with great habits.” Refactoring helps me be much more effective at writing robust code.


## Refactoring Helps Me Program Faster 
1. In the end, all the earlier points come down to this: Refactoring helps me develop code more quickly. 
2. This sounds counterintuitive. When I talk about refactoring, people can easily see that it improves quality. Better internal design, readability, reducing bugs — all these improve quality. But doesn’t the time I spend on refactoring reduce the speed of development? 
3. When I talk to software developers who have been working on a system for a while, I often hear that they were able to make progress rapidly at first, but now it takes much longer to add new features. Every new feature requires more and more time to understand how to fit it into the existing code base, and once it’s added, bugs often crop up that take even longer to fix. The code base starts looking like a series of patches covering patches, and it takes an exercise in archaeology to figure out how things work. This burden slows down adding new features — to the point that developers wish they could start again from a blank slate.
4. Software with a good internal design allows me to easily find how and where I need to make changes to add a new feature. Good modularity allows me to only have to understand a small subset of the code base to make a change. If the code is clear, I’m less likely to introduce a bug, and if I do, the debugging effort is much easier. Done well, my code base turns into a platform for building new features for its domain. 
5. I refer to this effect as the Design Stamina Hypothesis [mf­-dsh]: By putting our effort into a good internal design, we increase the stamina of the software effort, allowing us to go faster for longer. I can’t prove that this is the case, which is why I refer to it as a hypothesis. But it explains my experience, together with the experience of hundreds of great programmers that I’ve got to know over my career.
6. Twenty years ago, the conventional wisdom was that to get this kind of good design, it had to be completed before starting to program — because once we wrote the code, we could only face decay. 
7. Refactoring changes this picture. We now know we can improve the design of existing code — so we can form and improve a design over time, even as the needs of the program change. Since it is very difficult to do a good design up front, refactoring becomes vital to achieving that virtuous path of rapid functionality.


## References
* [*Refactoring: Improving the Design of Existing Code,Second Edition*](https://book.douban.com/subject/30332135/)
