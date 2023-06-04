import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ isRequired: true, unique: true })
    email: string;

    @Prop({ isRequired: true })
    password: string;

    @Prop()

    @Prop({ isRequired: true })
    profileImage: string;
}

export const UserSchema = SchemaFactory.createForClass(User);