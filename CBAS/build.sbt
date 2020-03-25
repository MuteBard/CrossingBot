name := "CBAS"

version := "0.1"

scalaVersion := "2.12.7"
lazy val akkaVersion = "2.6.1"
lazy val akkaHttpVersion = "10.1.11"
lazy val mongodbVersion = "1.1.2"
lazy val mongoDriverVersion = "2.9.0"
lazy val akkaCorsVersion = "0.4.2"

libraryDependencies ++= Seq(
	"com.typesafe.akka" %% "akka-stream" % akkaVersion,
	"com.typesafe.akka" %% "akka-http" % akkaHttpVersion,
	"com.typesafe.akka" %% "akka-http-spray-json" % akkaHttpVersion,
	"com.typesafe.akka" %% "akka-http-testkit" % akkaHttpVersion,
	"com.lightbend.akka" %% "akka-stream-alpakka-mongodb" % mongodbVersion,
	"org.mongodb.scala" %% "mongo-scala-driver" % mongoDriverVersion,
	"ch.megard" %% "akka-http-cors" % akkaCorsVersion
)