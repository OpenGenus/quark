# Median Sort

The median sort is an odd variation of Quicksort I have never seen or heard of until reading the O’Reilly Algorithms in a Nutshell book. It takes the median value as the pivot. Half of the list will be less than the median. The other half will be greater. So the median is an optimal pivot in the sense of splitting into equally sized sub-problems.

Finding the median in an unsorted list takes linear time. It can be done with another variation on Quicksort which partially sorts the list. The median pivots may be optimal but incur extra cost. However, a problem may have statistical properties that allow estimating the median more cheaply than linear time.


## Further Reading
[Median sort](https://equilibriumofnothing.wordpress.com/2013/10/16/algorithm-median-sort/)


A large scale collaboration of [OpenGenus](https://github.com/opengenus)
