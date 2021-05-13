# Pull Up Field

inverse of: Push Down Field

<!-- TOC -->

- [Pull Up Field](#pull-up-field)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
消除不必要的重复，统一管理。


## Motivation
1. If subclasses are developed independently, or combined through refactoring, I often find that they duplicate features. In particular, certain fields can be duplicates. 
2. Such fields sometimes have similar names — but not always. The only way I can tell what is going on is by looking at the fields and examining how they are used. 
3. If they are being used in a similar way, I can pull them up into the superclass. 
4. By doing this, I reduce duplication in two ways. I remove the duplicate data declaration and I can then move behavior that uses the field from the subclasses to the superclass.
5. Many dynamic languages do not define fields as part of their class definition — instead, fields appear when they are first assigned to. In this case, pulling up a field is essentially a consequence of *Pull Up Constructor Body*.


## Mechanics
1. Inspect all users of the candidate field to ensure they are used in the same way. 
2. If the fields have different names, use Rename Field to give them the same name.
3. Create a new field in the superclass.
    * The new field will need to be accessible to subclasses (protected in common languages).
4. Delete the subclass fields.
5. Test


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
