import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface Participant {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class LuckyDrawService {
  private apiUrl = 'http://localhost:3000/participants';

  constructor(private http: HttpClient) {}

  getParticipants(): Observable<string[]> {
    return this.http.get<Participant[]>(this.apiUrl).pipe(
      map((participants) => participants.map((p) => p.name))
    );
  }

  drawWinner(participants: string[]): string {
    const randomIndex = Math.floor(Math.random() * participants.length);
    return participants[randomIndex];
  }
}