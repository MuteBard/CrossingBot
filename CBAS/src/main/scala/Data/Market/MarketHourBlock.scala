package Data.Market

import scala.util.Random

object MarketHourBlock {
	import Data.Market.MarketQuarterBlock.{QuarterBlock, QuarterBlockJsonProtocol}
	import spray.json.DefaultJsonProtocol

	case class HourBlock(quarterBlocks : List[QuarterBlock] = null, name : String = ""){

		def mechanism(p1 : QuarterBlock, p2 : QuarterBlock, p3 : QuarterBlock, name: String, hourBlockId : Int ) : HourBlock = {
			val random = new Random
			HourBlock((0 to 3).map(quarterBlockId => {
				val value = random.nextInt(3) + 1
				value match {
					case 1 => p1.create(hourBlockId, quarterBlockId)
					case 2 => p2.create(hourBlockId, quarterBlockId)
					case 3 => p3.create(hourBlockId, quarterBlockId)
				}
			}).toList, name)
		}

		def sleepy(hourBlockId : Int): HourBlock = {
			HourBlock((0 to 3).map(quarterBlockId => block("d").create(hourBlockId, quarterBlockId)).toList, "sleepy")
		}

		def normal(hourBlockId : Int) : HourBlock = {
			mechanism(block("c"), block("d"), block("e"), "normal", hourBlockId)
		}

		def good(hourBlockId : Int) : HourBlock = {
			mechanism(block("b"), block("c"), block("d"), "good", hourBlockId )
		}

		def bad(hourBlockId : Int) : HourBlock = {
			mechanism(block("d"), block("e"), block("f"), "bad", hourBlockId )
		}

		def random(hourBlockId : Int) : HourBlock = {
			val random = new Random
			HourBlock((0 to 3).map(QuarterBlockId => {
				val value = random.nextInt(7) + 1
				value match {
					case 1 => block("a").create(hourBlockId, QuarterBlockId)
					case 2 => block("b").create(hourBlockId, QuarterBlockId)
					case 3 => block("c").create(hourBlockId, QuarterBlockId)
					case 4 => block("d").create(hourBlockId, QuarterBlockId)
					case 5 => block("e").create(hourBlockId, QuarterBlockId)
					case 6 => block("f").create(hourBlockId, QuarterBlockId)
					case 7 => block("g").create(hourBlockId, QuarterBlockId)
				}
			}).toList, "random")
		}

		def risky(hourBlockId : Int) : HourBlock = {
			val random = new Random
			HourBlock((0 to 3).map(quarterBlockId => {
				val value = random.nextInt(2) + 1
				value match {
					case 1 => block("a").create(hourBlockId, quarterBlockId)
					case 2 => block("g").create(hourBlockId, quarterBlockId)
				}
			}).toList, "risky")
		}
	}


	val block : Map[String, QuarterBlock] = Map(
		"a" -> QuarterBlock("heavenly", 0, 0, 100, 50, "+"),
		"b" -> QuarterBlock("awesome", 0, 0, 35, 15, "+"),
		"c" -> QuarterBlock("good", 0, 0,15, 5, "+"),
		"d" -> QuarterBlock("neutral",0, 0, 5, 0, "#"),
		"e" -> QuarterBlock("bad", 0, 0, 15, 5, "-"),
		"f" -> QuarterBlock("awful",0, 0, 35, 15, "-"),
		"g" -> QuarterBlock("hellish", 0, 0, 100, 50, "-")
	)

	trait HourBlockJsonProtocol extends DefaultJsonProtocol with QuarterBlockJsonProtocol{
		implicit val HourBlockJson = jsonFormat2(HourBlock)
	}
}