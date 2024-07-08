import { Component, HostListener, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { PlayerComponent } from '../Player/Player.component';
import { ObstacleComponent } from '../Obstacle/Obstacle.component';
import { CommonModule } from '@angular/common';

interface Player {
  lane: number;
}

interface Obstacle {
  lane: number;
  position: number;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./Game.component.css'],
  standalone: true,
  imports: [CommonModule, PlayerComponent, ObstacleComponent]
})
export class GameComponent implements OnInit {
  lanes = [0, 1, 2];
  player: Player = { lane: 1 };
  obstacles: Obstacle[] = [];
  gameLoop!: Subscription;

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    this.gameLoop = interval(100).subscribe(() => {
      this.updateObstacles();
      this.checkCollisions();
    });

    // Add initial obstacles
    this.addObstacle();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.movePlayer(-1);
    } else if (event.key === 'ArrowRight') {
      this.movePlayer(1);
    }
  }

  movePlayer(direction: number) {
    const newLane = this.player.lane + direction;
    if (newLane >= 0 && newLane < this.lanes.length) {
      this.player.lane = newLane;
    }
  }

  updateObstacles() {
    this.obstacles = this.obstacles.map(obstacle => {
      return { ...obstacle, position: obstacle.position + 5 };
    }).filter(obstacle => obstacle.position < 100);

    if (Math.random() < 0.1) {
      this.addObstacle();
    }
  }

  addObstacle() {
    const lane = Math.floor(Math.random() * this.lanes.length);
    this.obstacles.push({ lane, position: 0 });
  }

  checkCollisions() {
    this.obstacles.forEach(obstacle => {
      if (obstacle.lane === this.player.lane && obstacle.position > 90 && obstacle.position < 100) {
        // Collision detected
        alert('Game Over!');
        this.gameLoop.unsubscribe();
      }
    });
  }
}
