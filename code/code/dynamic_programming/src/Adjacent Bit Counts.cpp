/*
For a string of n bits x1,x2,x3,...,Xn the adjacent bit count of the string (AdjBC(x)) is given by
X1*X2 + X2*X3 + X3*X4 + ... + Xn-1 * Xn
which counts the number of times a 1 bit is adjacent to another 1 bit. For example:
AdjBC(011101101) = 3
AdjBC(111101101) = 4
AdjBC(010101010) = 0
Write a program which takes as input integers n and k and returns the number of bit strings x of n bits (out of 2ⁿ) that satisfy AdjBC(x) = k. For example, for 5 bit strings, there are 6 ways of getting AdjBC(x) = 2:
11100, 01110, 00111, 10111, 11101, 11011
Input
The first line of input contains a single integer P, (1 ≤ P ≤ 1000), which is the number of data sets that follow. Each data set is a single line that contains the data set number, followed by a space, followed by a decimal integer giving the number (n) of bits in the bit strings, followed by a single space, followed by a decimal integer (k) giving the desired adjacent bit count. The number of bits (n) will not be greater than 100.
Output
For each data set there is one line of output. It contains the data set number followed by a single space, followed by the number of n-bit strings with adjacent bit count equal to k. As answer can be very large print your answer modulo 10^9+7.
Sample Input
10
1 5 2
2 20 8
3 30 17
4 40 24
5 50 37
6 60 52
7 70 59
8 80 73
9 90 84
10 100 90
Sample Output
1 6
2 63426
3 1861225
4 168212501
5 44874764
6 160916
7 22937308
8 99167
9 15476
10 23076518
*/

// C++ program to count number of binary strings 
// with k times appearing consecutive 1's. 
//http://shuklas664.blogspot.com/2015/01/gnyr09f-solution.html
#include <bits/stdc++.h> 
using namespace std; 
#define ll long long int 
#define M 1000000007

int count(int n, int k) 
{ 
	// dp[i][j][0] stores count of binary 
	// strings of length i with j consecutive 
	// 1's and ending at 0. 
	// dp[i][j][1] stores count of binary 
	// strings of length i with j consecutive 
	// 1's and ending at 1. 
	int dp[n + 1][k + 1][2]; 
	memset(dp, 0, sizeof(dp)); 

	// If n = 1 and k = 0. 
	dp[1][0][0] = 1; //ADJACENT KUCH NHI HAI TOH  TOH BAAR BAAR ZERO HI HO JAIGA TO EK STRING POSSIBLE HOGI ZERO KI
	dp[1][0][1] = 1; 

	for (int i = 2; i <= n; i++) { //I IS SIZE J IS ADJACENT BIT COUNT 3RD IS THE BIT TO BE ADDED
		// number of adjacent 1's can not exceed i-1 
		for (int j = 0; j <=k; j++) { 
			dp[i][j][0] = ((dp[i - 1][j][0]%M) + (dp[i - 1][j][1]%M))%M; 
			dp[i][j][1] = (dp[i - 1][j][0])%M; 
			if (j - 1 >= 0) // AVOIDING OVERFLOW CONDITION WHEN J=0.
				dp[i][j][1] += (dp[i - 1][j - 1][1])%M; 
		} 
	} 

	return ((dp[n][k][0]%M) + (dp[n][k][1]%M))%M; 
} 

// Driver code 
int main() 
{ 
	ll n,m,k,i,j,x,z,t;
    cin>>t;
    while(t--)
    {
        cin>>i>>j>>k;
        cout<<i<<" "<<count(j,k)<<endl;
    }
	return 0; 
}
