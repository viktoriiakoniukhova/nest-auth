import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public email: string;

  @Column({ default: false })
  public isEmailConfirmed: boolean;

  @Column()
  public name: string;

  @Column()
  public password: string;

  @Column({
    default:
      'https://res.cloudinary.com/dkcxlcszh/image/upload/v1695048980/srw49uxxdjfdpumdtcwb.jpg',
  })
  public avatarURL: string;
}
