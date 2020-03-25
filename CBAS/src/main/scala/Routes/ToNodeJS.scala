package Routes
import Actors.{BugActor, FishActor, StartActor, UserActor}
import Logic.Main.system
import Model.Major.Pocket_._
import Model.Minor.Months_._
import Model.Major.Bug_._
import Model.Major.Fish_._
import Model.Major.User_._
import akka.actor.Props
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.pattern.ask
import akka.util.Timeout
import ch.megard.akka.http.cors.scaladsl.CorsDirectives._

import scala.concurrent.Await
import scala.concurrent.duration._

object ToNodeJS extends
	UserJsonProtocol with
	BugJsonProtocol with
	FishJsonProtocol with
	MonthsJsonProtocol with
	PocketJsonProtocol with
	SprayJsonSupport {


	val startupActor = system.actorOf(Props[StartActor],"StartupActor")
	val bugActor = system.actorOf(Props[BugActor], "BugActor")
	val fishActor = system.actorOf(Props[FishActor], "FishActor")
	val userActor = system.actorOf(Props[UserActor], "UserActor")
	import system.dispatcher

	implicit val timeout = Timeout(5 seconds)

	val routes =
		cors(){
			pathPrefix("api"){
				get{
					path("AddAllBugFish"){
						startupActor ! StartActor.Create_Animals_All
						complete(StatusCodes.OK)
					} ~
					path("bugAll") {
						val AllBugsFuture = (bugActor ? BugActor.Read_Bug_All).mapTo[List[Bug]]
						complete(AllBugsFuture)
					} ~
					path("bugId"/ IntNumber) {
						id => {
							val oneBugFuture = (bugActor ? BugActor.Read_One_Bug_By_Id(id)).mapTo[Bug]
							complete(oneBugFuture)
						}
					} ~
					path("fishesAll"){
						val AllFishesFuture = (fishActor ? FishActor.Read_Fish_All).mapTo[List[Fish]]
						complete(AllFishesFuture)
					} ~
					path("fishId"/ IntNumber) {
						id => {
							val oneFishFuture = (fishActor ? FishActor.Read_One_Fish_By_Id(id)).mapTo[Fish]
							complete(oneFishFuture)
						}
					} ~
					path("user" / Segment) {
						username => {
							val oneUser : User = Await.result((userActor ? UserActor.Read_One_User(username)).mapTo[User], 3 seconds)
							if (oneUser.username!="NULL/USER") complete(oneUser)
							else complete(StatusCodes.NotFound)


						}
					}
				} ~
				post{
					path("ListBugByMonths"){
						entity(as[Months]) { months =>
							val monthBugsFuture = (bugActor ? BugActor.Read_All_Bug_By_Month(months.availability)).mapTo[List[Bug]]
							complete(monthBugsFuture)
						}
					} ~
					path("retrieveOneBugByMonths"){
						entity(as[Months]) { months =>
							val oneBugFuture = (bugActor ? BugActor.Read_One_Bug_By_Random(months.availability)).mapTo[Bug]
							complete(oneBugFuture)
						}
					} ~
					path("ListRarestBugByMonths"){
						entity(as[Months]) { months =>
							val rarestBugFuture = (bugActor ? BugActor.Read_All_Rarest_Bug_By_Month(months.availability)).mapTo[List[Bug]]
							complete(rarestBugFuture)
						}
					} ~
					path("ListFishByMonths"){
						entity(as[Months]) { months =>
							val monthFishesFuture = (fishActor ? FishActor.Read_All_Fish_By_Month(months.availability)).mapTo[List[Fish]]
							complete(monthFishesFuture)
						}
					} ~
					path("retrieveOneFishByMonths") {
						entity(as[Months]) { months =>
							val oneFishFuture = (fishActor ? FishActor.Read_One_Fish_By_Random(months.availability)).mapTo[Fish]
							complete(oneFishFuture)
						}
					} ~
					path("ListRarestFishByMonths") {
						entity(as[Months]) { months =>
							val rarestFishFuture = (fishActor ? FishActor.Read_All_Rarest_Fish_By_Month(months.availability)).mapTo[List[Fish]]
							complete(rarestFishFuture)
						}
					} ~
					path("AddToPocket"){
						entity(as[User]) { user =>
							val userExists : Boolean = Await.result((userActor ? UserActor.Update_One_User_With_Creature(user)).mapTo[Boolean], 3 seconds)
							if (userExists) complete("Success, updated user's pocket")
							else complete("Incomplete, user does not exist. Need to create user to associate to pocket")
						}
					} ~
					path("AddUser"){
						entity(as[User]) { user =>
							userActor ! UserActor.Create_One_User(user)
							complete("Success, created user")
						}
					}
				}
			}
		}


	Http().bindAndHandle(routes, "localhost", 4774)
}

