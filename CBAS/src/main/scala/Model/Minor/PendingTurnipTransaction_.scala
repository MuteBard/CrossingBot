package Model.Minor

object PendingTurnipTransaction_ {
	import spray.json.DefaultJsonProtocol

	case class PendingTurnipTransaction(
		                    username : String,
		                    business: String,
		                    amount: Int,
		                    marketPrice : Int,
		                    totalBells: Int,
		                    message: String,
	                    )

	trait PendingTurnipTransactionJsonProtocol extends DefaultJsonProtocol{
		implicit val PendingTurnipTransactionJson = jsonFormat6(PendingTurnipTransaction)
	}
}
