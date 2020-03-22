package Model.OutBound

import Model.OutBound.Bug_.Bug
import Model.OutBound.Fish_.Fish

object User_ {
	import spray.json.DefaultJsonProtocol
	case class User(
		               _id : Int,
		               username : String,
		               fishingPoleLvl : Int,
		               bugNetLvl : Int,
		               bells : Int,
		               turnips : Int,
		               bugPocket : List[Bug],
		               fishPocket : List[Fish],
		               img : String,
	               )

	trait UserJsonProtocol extends DefaultJsonProtocol{
		implicit val BugJson = jsonFormat7(Bug)
		implicit val FishJson = jsonFormat7(Fish)
		implicit val UserJson = jsonFormat9(User)
	}
}
