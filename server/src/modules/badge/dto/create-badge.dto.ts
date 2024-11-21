export class CreateBadgeDto {
    name: string;
    picture: string;
    picturef: string;
    location: string;
    userId: string;      // ID of the user creating the badge
    monumentId?: string;  // ID of the associated monument
    username:string;
}