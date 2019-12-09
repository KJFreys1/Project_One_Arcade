Bomberman: Reboot

Description: 
 Bomberman is a classic, 2D game involving a player versus 3 AI characters. The goal is to be the last one standing at the end. Use bombs to eliminate the other players while dodging the explosions.

 Plan:

 - Bronze (Monday):
    - Generate map with stone and grass elements.
    - Create white block (player) that can move based on user input and will not move into a stone element.

- Silver Part One (Tuesday):
    - Create bomb element that explodes.
        - Bomb creates fire that goes in all four directions for maximum two squares.
        - If fire hits stone, don't show fire over or past stone.
        - If player is in fire, player dies.
    - Generate brick elements that can be destroyed by bomb.
        - Only destroys maximum of one brick in each direction.

- Silver Part Two (Wednesday):
    - Add animations to player.
        - Specific animation when moving a certain direction.
        - Specific animation when player isn't moving.
        - Specific animation when player dies.

- Gold (Wednesday - Thursday):
    - Add other characters with AI.
        - Enemies will place bombs down randomly and know when to stay away from their own bombs.
        - Enemies will continue to move randomly until out of danger, then will not move back into danger.
        - Enemy bombs can kill other enemies and player.

- Platinum (if time allows...):
    - Add 'lives' to player and enemies.
        - If lives run out for player, game is over.
        - If lives run out for enemy, the enemy no longer appears for the next round.
        - Game is over when all enemies have lost their lives.
    - Add timer that, when up, begins to shrink the arena so until there is no room.
        - If outside shrinks down onto enemy or player, that character dies imediately.
    - If player gets out in a round, round continues until only one enemy bomber is left.
    - Add animation sequence for winner (along with second, third and fourth place).
    - Add 2-player option.