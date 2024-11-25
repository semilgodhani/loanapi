import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';

@Table({ timestamps: true })
export class Loan extends Model<Loan> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  loanid: number;

  @Column({ type: DataType.INTEGER })
  userid: number;

  @Column({ type: DataType.INTEGER })
  amount: number;

  @Column({ type: DataType.INTEGER })
  principalrate: number;

  @Column({ type: DataType.DATE })
  disbursementdate: Date;

  @Column({ type: DataType.BOOLEAN })
  loanstatus: boolean;

  @Column({ type: DataType.DATE })
  closingdate: Date;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  email: string;
}
