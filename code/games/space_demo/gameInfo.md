1. Controls 

	- Left Arrow key : Move Left
	- Right Arrow key : Move Right
	- Space Bar : Shoot

2. Player placed at the bottom of canvas and is firing on press of spacebar

3. The player moves in two directions (left, right) within canvas bounds.

4. Enemies are continoulsy falling from top

5. Enemies disapppear as soon as they are hit with the bullet

6. Each successful enemy kill adds 10 points to the score, the score is displayed on the top right corner

7. The Player has 3 Lifes, displayed at the top left corner of screen , and a life keeps reducing with each player crossing the player without being Hit

8. Levels are displayed on the top right corner of screen and keeps increasing when the main score reaches multiples of 500. Level is responsible for Enemy and Special Enemy falling speed and number of bullets required to destroy Special Enemy. Level also changes the Enemy type.

9. Another type of enemy, Special Enemy different from normal 10 pointer Enemies also falls with a lesser frequency. They need more bullets to be destroyed depending on the level.And adds a bonus of 20 points to the displayed total score.

10. Enemies Hit, bullet fire, Game end, all make sounds saved in the sound folder.

11. Game ends under following cases :
	- Player looses all 3 lifes (When 3 Enemies are missed)
	- Special Enemy is missed and it crosses the canvas
	- Enemy/Special Enemy hits the player

12. Game Restarts on clicking anywhere on the canvas when the game ends.