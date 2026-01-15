
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.locations.list.path, async (req, res) => {
    const locations = await storage.getLocations();
    res.json(locations);
  });

  app.get(api.locations.get.path, async (req, res) => {
    const location = await storage.getLocation(Number(req.params.id));
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(location);
  });

  // Seed data if empty
  const existing = await storage.getLocations();
  if (existing.length === 0) {
    const seeds = [
      {
        name: "Kyoto, Japan",
        description: "The cultural capital of Japan, famous for its classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses.",
        latitude: 35.0116,
        longitude: 135.7681,
        category: "culture",
        imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80"
      },
      {
        name: "Santorini, Greece",
        description: "A volcanic island in the Cyclades group of the Greek islands. It is famous for its dramatic views, stunning sunsets from Oia town, strange white aubergine (eggplant), and its very own active volcano.",
        latitude: 36.3932,
        longitude: 25.4615,
        category: "nature",
        imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80"
      },
      {
        name: "Machu Picchu, Peru",
        description: "A 15th-century Inca citadel, located in the Eastern Cordillera of southern Peru, on a 2,430-metre (7,970 ft) mountain ridge.",
        latitude: -13.1631,
        longitude: -72.5450,
        category: "history",
        imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80"
      },
      {
        name: "Reykjavik, Iceland",
        description: "The capital and largest city of Iceland. It is located in southwestern Iceland, on the southern shore of Faxaflói bay.",
        latitude: 64.1466,
        longitude: -21.9426,
        category: "city",
        imageUrl: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&q=80"
      },
      {
        name: "Cape Town, South Africa",
        description: "A port city on South Africa's southwest coast, on a peninsula beneath the imposing Table Mountain.",
        latitude: -33.9249,
        longitude: 18.4241,
        category: "city",
        imageUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80"
      }
    ];

    for (const seed of seeds) {
      await storage.createLocation(seed);
    }
  }

  return httpServer;
}
