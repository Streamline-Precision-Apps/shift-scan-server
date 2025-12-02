"use client";
import { Bases } from "./components/(reusable)/bases";
import { Contents } from "./components/(reusable)/contents";
import { Grids } from "./components/(reusable)/grids";
import HamburgerMenuNew from "./components/(animations)/hamburgerMenuNew";
import WidgetSection from "./(content)/widgetSection";
import { Capacitor } from "@capacitor/core";

export default function Home() {
  const ios = Capacitor.getPlatform() === "ios";
  const android = Capacitor.getPlatform() === "android";
  return (
    <Bases>
      <Contents>
        <Grids
          rows={"8"}
          gap={"5"}
          className={ios ? "pt-12" : android ? "pt-4" : ""}
        >
          <HamburgerMenuNew isHome={true} />
          <WidgetSection />
        </Grids>
      </Contents>
    </Bases>
  );
}
