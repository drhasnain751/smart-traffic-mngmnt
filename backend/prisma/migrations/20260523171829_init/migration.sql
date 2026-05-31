-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OPERATOR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Intersection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "congestionLevel" REAL NOT NULL DEFAULT 0.0,
    "vehicleCount" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Road" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "laneCount" INTEGER NOT NULL DEFAULT 2,
    "capacity" INTEGER NOT NULL DEFAULT 100,
    "currentSpeed" REAL NOT NULL DEFAULT 50.0,
    "intersectionId" TEXT NOT NULL,
    CONSTRAINT "Road_intersectionId_fkey" FOREIGN KEY ("intersectionId") REFERENCES "Intersection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Signal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "intersectionId" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'AUTO',
    "activeState" TEXT NOT NULL DEFAULT 'RED',
    "timerSeconds" INTEGER NOT NULL DEFAULT 30,
    "redDuration" INTEGER NOT NULL DEFAULT 30,
    "yellowDuration" INTEGER NOT NULL DEFAULT 5,
    "greenDuration" INTEGER NOT NULL DEFAULT 35,
    "lastStateChange" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Signal_intersectionId_fkey" FOREIGN KEY ("intersectionId") REFERENCES "Intersection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrafficFlow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "intersectionId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehicleCount" INTEGER NOT NULL,
    "averageSpeed" REAL NOT NULL,
    "occupancyRate" REAL NOT NULL,
    "densityLevel" TEXT NOT NULL,
    CONSTRAINT "TrafficFlow_intersectionId_fkey" FOREIGN KEY ("intersectionId") REFERENCES "Intersection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "generatedBy" TEXT NOT NULL,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parameters" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "intersectionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME,
    CONSTRAINT "Alert_intersectionId_fkey" FOREIGN KEY ("intersectionId") REFERENCES "Intersection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
