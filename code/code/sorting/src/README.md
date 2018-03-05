# Tree Sort

A tree sort is a sort algorithm that builds a binary search tree from the elements to be sorted, and then traverses the tree (in-order) so that the elements come out in sorted order. Its typical use is sorting elements online: after each insertion, the set of elements seen so far is available in sorted order.

Adding one item to a binary search tree is on average an O(log n) process (in big O notation). Adding n items is an O(n log n) process, making tree sorting a 'fast sort' process. Adding an item to an unbalanced binary tree requires O(n) time in the worst-case: When the tree resembles a linked list (degenerate tree). This results in a worst case of O(n²) time for this sorting algorithm. This worst case occurs when the algorithm operates on an already sorted set, or one that is nearly sorted, reversed or nearly reversed. Expected O(n log n) time can however be achieved by shuffling the array, but this does not help for equal items.

The worst-case behaviour can be improved by using a self-balancing binary search tree. Using such a tree, the algorithm has an O(n log n) worst-case performance, thus being degree-optimal for a comparison sort. However, trees require memory to be allocated on the heap, which is a significant performance hit when compared to quicksort and heapsort. When using a splay tree as the binary search tree, the resulting algorithm (called splaysort) has the additional property that it is an adaptive sort, meaning that its running time is faster than O(n log n) for inputs that are nearly sorted.


## Further Reading
[Wikipedia - Tree sort](https://en.wikipedia.org/wiki/Tree_sort)


A large scale collaboration of [OpenGenus](https://github.com/opengenus)
