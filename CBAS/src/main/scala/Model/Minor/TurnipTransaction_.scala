package Model.Minor

object TurnipTransaction_ {
	import spray.json.DefaultJsonProtocol

	case class TurnipTransaction(
		                    username : String,
		                    business: String,
		                    amount: Int,
		                    marketPrice : Int,
		                    totalBells: Int,
		                    message: String,
	                    )

	trait TurnipTransactionJsonProtocol extends DefaultJsonProtocol{
		implicit val TurnipTransactionJson = jsonFormat6(TurnipTransaction)
	}
}
