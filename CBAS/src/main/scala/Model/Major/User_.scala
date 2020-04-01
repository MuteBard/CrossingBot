package Model.Major

import Model.Major.TurnipTransaction_.{TurnipTransaction, TurnipTransactionJsonProtocol}
import Pocket_.{Pocket, PocketJsonProtocol}

object User_ {
	import spray.json.DefaultJsonProtocol
	case class User(
		               _id : Int = 0,
		               username : String = "NULL/USER",
		               fishingPoleLvl : Int = 0,
		               bugNetLvl : Int = 0,
		               bells : Int = 0,
		               pocket : Pocket = Pocket(),
		               liveTurnips : TurnipTransaction = TurnipTransaction(),
		               turnipTransactionHistory : List[TurnipTransaction] = List(),
		               img : String = "",
	               )

	trait UserJsonProtocol extends DefaultJsonProtocol with PocketJsonProtocol with TurnipTransactionJsonProtocol {
		implicit val UserJson = jsonFormat9(User)
	}
}
