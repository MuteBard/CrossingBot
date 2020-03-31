package Model.Major

import spray.json.DefaultJsonProtocol

object ConfirmedTurnipTranaction_ {
	case class ConfirmedTurnipTransaction(
        business: String,
        activelyInMarket: Boolean,
        amount: Int,
        marketPrice : Int,
        totalBells: Int,
        netGainLossAsBells : Int,
        netGainLossAsPercentage: Int
        )

	trait ConfirmedTurnipTransactionJsonProtocol extends DefaultJsonProtocol{
		implicit val ConfirmedTurnipTransactionJson = jsonFormat7(ConfirmedTurnipTransaction)
	}
}


