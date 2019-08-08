from __future__ import annotations
from typing import List

def int_division(a:int,b:int)->List:
    """
    Implementation of the Division Algorithm
        -If a,b are elements of the naturals
        -There exists a unique pair of integers q,r with q>=0 and 0<=r<b
        -Such that a = (q*b) + r
    >>> int_division(7,2)
    [3,2,1]
    >>> int_division(4,1)
    [4,1,0]
    """
    quotient = a//b
    remainder = a%b
    return [quotient,b,remainder]

def euclidean_algorithm(a:int,b:int)->int:
    """
    Implementation of the Euclidean Algorithm
    >>> euclidean_algorithm(4,9)
    1
    >>> euclidean_algorithm(23814,8232)
    294
    """
    remainder = int_division(a, b)[2]
    c = int_division(a, b)[1]
    quotient = int_division(a, b)[0]
    if remainder == 0:
        return c
    else:
        return euclidean_algorithm(c, remainder)
