export enum ViewerToProjectStatus {
  NOTHING = 'nothing', //nothing happend so the project may appear on viewer's feed again
  LIKED = 'liked', //when viewer liked the project and want to talk to owner
  REJECTED = 'rejected', //when viewer don't like the project and never wanna
  //see it again on his/her feed
  ACCEPTED = 'accepted', //when viewer liked the project and owner accepted the request
}
