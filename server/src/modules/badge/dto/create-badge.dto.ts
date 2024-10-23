export class CreateBadgeDto {
    name: string;
    picture: string;
    location: string;
    username: string;      // ID of the user creating the badge
    monumentId?: string;  // ID of the associated monument
}