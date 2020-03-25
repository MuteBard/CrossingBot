package Actors

import Dao.UserOperations
import Model.Major.User_._
import akka.actor.{Actor, ActorLogging}

object UserActor {
	case class Create_One_User(user : User )
	case class Read_One_User(username : String)
	case class Update_One_User_With_Creature(user : User)

}

class UserActor extends Actor with ActorLogging{
	import UserActor._
	override def receive: Receive = {
		case Read_One_User(username) =>
			log.info(s"Getting user with username $username")

			val userList = UserOperations.readOneUser(username)
			Option(userList.head) match {
				case Some(user) => sender() ! user
				case None => sender() ! User()
			}
		case Update_One_User_With_Creature(user) =>
			log.info(s"Adding creature to ${user.username}'s pocket")
			UserOperations.updateUser(user)
			log.info(s"Checking to see if user ${user.username} exists")
			val exists = UserOperations.readOneUser(user.username).length == 1
			if (exists){
				log.info("User exists")
			}else
				log.info("User does not exist")
			sender ! exists
		case Create_One_User(user) =>
			log.info(s"Inserting user in Database")
			UserOperations.createOneUser(user)



	}
}
