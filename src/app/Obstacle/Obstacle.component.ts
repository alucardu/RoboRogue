import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-obstacle',
  template: '',
  styleUrls: ['./Obstacle.component.css'],
  standalone: true
})
export class ObstacleComponent {
  @Input() position!: number;

  @HostBinding('style.top.%')
  get top() {
    return this.position;
  }
}
