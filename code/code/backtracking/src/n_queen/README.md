# The N-Queens Problem

The N-Queens problem is one of the most common examples to describe the backtracking algorithmic approach. It is an extension of the traditional 8 Queens Problem and is stated as follows:

_“Given an NxN chessboard, place N queens on it such that none of them are in a position to attack another (i.e. no two queens are in the same row, column, or diagonal).”_

This problem can be solved using a naïve approach, where we first check if all configurations of arrangement have been exhausted. If not, we generate the next possible configuration and check if it is a valid arrangement. If a valid arrangement is found, it is returned and the program exits. This is a poor solution because as the size of n increases, the number of possible permutations increases by a huge order. The growth rate of the output set or the complexity in simple terms is huge and entirely unpredictable, even for relatively smaller values of n. We must look for a more efficient solution.

The backtracking algorithm to solve the N-Queens problem is as follows:
1. Start with the left-most column on the chessboard
2. If all queens have been placed, return true
3. Now try other rows in the current column. For each row:
    1. If (queen can be placed safely) then
        1. Mark row
    2. If (placing queen in [row,col] leads to solution) then
        1. Return true
    3. Else
        1. Unmark this row-col pair
        1. Backtrack to step i. to try other rows
4. If all rows have been tried and nothing works, return false
