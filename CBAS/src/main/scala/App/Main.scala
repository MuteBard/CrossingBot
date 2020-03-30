package App

import Actors.StartActor.StartMarketTimers
import Actors._
import Helper.Auxiliary._
import Routes.ToCBTC
import akka.actor.{ActorSystem, Props}

object Main extends App{
	implicit val system = ActorSystem("CBAS")
	val startupActor = system.actorOf(Props[StartActor],"StartupActor")
	val bugActor = system.actorOf(Props[BugActor], "BugActor")
	val fishActor = system.actorOf(Props[FishActor], "FishActor")
	val userActor = system.actorOf(Props[UserActor], "UserActor")
	val marketActor = system.actorOf(Props[MarketActor], "MarketActor")

	log.info("Main", "CBAS booting up...")
	log.info("Main", "CBAS starting up schedulers")
	marketActor ! StartMarketTimers
	ToCBTC
	log.info("Main", "CBAS listening at localhost:4774/api/")
}
