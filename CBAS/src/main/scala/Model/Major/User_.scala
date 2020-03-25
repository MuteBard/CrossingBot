package Model.Major

import Pocket_.{Pocket, PocketJsonProtocol}

object User_ {
	import spray.json.DefaultJsonProtocol
	case class User(
		               _id : Int = 0,
		               username : String = "NULL/USER",
		               fishingPoleLvl : Int = 0,
		               bugNetLvl : Int = 0,
		               bells : Int = 0,
		               pocket : Pocket = null,
		               turnips : Int = 0,
		               img : String = "",
	               )

	trait UserJsonProtocol extends DefaultJsonProtocol with PocketJsonProtocol {
		implicit val UserJson = jsonFormat8(User)
	}
}
