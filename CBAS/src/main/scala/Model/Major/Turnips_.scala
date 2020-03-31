package Model.Major

import spray.json.DefaultJsonProtocol

object Turnips_ {
	case class Turnips(
		                 amount : Int,
		                 boughtPrice : Int,
		                 marketPrice : Int,
		                 totalBells : Int
	                 )
	trait TurnipsTransactionJsonProtocol extends DefaultJsonProtocol{
		implicit val TurnipsJson = jsonFormat4(Turnips)
	}
}
