package Logic

import java.util.Calendar

import Routes.ToNodeJS
import Helper.Auxiliary._
import akka.actor.ActorSystem

object Main extends App{
	implicit val system = ActorSystem("CBAS")
	log.info("Main", "CBAS booting up...")
	ToNodeJS
	log.info("Main", "CBAS listening at localhost:4774/api/")

}
