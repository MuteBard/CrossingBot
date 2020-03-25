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
			log.info(s"[Read_One_User] Getting USER with username $username")
			val userSeq = UserOperations.readOneUser(username)
			val userExists = userSeq.nonEmpty

			if(userExists){
				log.info(s"[Read_One_User] USER $username found")
				sender() ! userSeq.head
			}else {
				log.info(s"[Read_One_User] USER $username does not exist")
				sender() ! User()
			}


		case Update_One_User_With_Creature(user) =>
			log.info(s"[Update_One_User_With_Creature] Adding BUG/FISH to ${user.username}'s pocket")
			UserOperations.updateUser(user)
			log.info(s"[Update_One_User_With_Creature] Verifying if USER with username ${user.username} exists")
			val exists = UserOperations.readOneUser(user.username).length == 1
			if (exists){
				log.info("[Update_One_User_With_Creature] USER exists")
			}else
				log.info("[Update_One_User_With_Creature] USER does not exist")
			sender() ! exists


		case Create_One_User(user) =>
			log.info(s"[Create_One_User] Inserting USER in Database")
			UserOperations.createOneUser(user)



	}
}
