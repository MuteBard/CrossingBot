package Model.Major

import spray.json.DefaultJsonProtocol

object ConfirmedTurnipTranaction_ {
	case class ConfirmedTurnipTransaction(
        business: String = "",
        activelyInMarket: Boolean = false,
        amount: Int = -1,
        marketPrice : Int = -1,
        totalBells: Int = -1,
        netGainLossAsBells : Int = 0,
        netGainLossAsPercentage: Int = 0
        )

	trait ConfirmedTurnipTransactionJsonProtocol extends DefaultJsonProtocol{
		implicit val ConfirmedTurnipTransactionJson = jsonFormat7(ConfirmedTurnipTransaction)
	}
}