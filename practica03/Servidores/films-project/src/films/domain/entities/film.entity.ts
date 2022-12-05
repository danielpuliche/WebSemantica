import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class FilmEntity {
  @ObjectIdColumn()
  id: number;

  @Column()
  name: String;

  @Column()
  genre: String;

  @Column()
  runningTime: number;

  @Column()
  releaseYear: number;
}