const regislets = [
  {
    name: "Accuracy Boost",
    maxLv: 10,
    effect: "Increases Accuracy by 1 per Regislet Level",
    desc: "",
    from: ["Stoodie Lv10 - Underground Ruins", "Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv230 - Kabla Jabali", "Stoodie Lv250 - Pipeline Corridor", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Arrow Rain Enhancer",
    maxLv: 2,
    effect: "An additional attack is added to the skill \"Arrow Rain\" (+1 hit per Level)",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Assassin Stab Enhancer",
    maxLv: 10,
    effect: "Raises the power of \"Assassin Stab\" by (1% per Regislet Level)%. Furthermore, the accuracy is raised by (10 × Registlet Level)% if it is Back Stab.",
    desc: "",
    from: ["Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Attack Speed Boost",
    maxLv: 100,
    effect: "Increases ASPD by 1 per Regislet Level",
    desc: "",
    from: ["Stoodie Lv10 - Underground Ruins", "Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv230 - Kabla Jabali", "Stoodie Lv250 - Pipeline Corridor", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Attacker's Pet",
    maxLv: 10,
    effect: "Raises the damage dealt by pet by 3% per Registlet Level, but greatly decreases its owner's damage",
    desc: "",
    from: ["Stoodie Lv110 - Blazing Graben", "Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Aura Blade Force",
    maxLv: 8,
    effect: "Releases a shock wave (single target attack). Dealing 10(+10 per Regislet Level)% damage if the monster targeted by \"Aura Blade\" is out of range",
    desc: "",
    from: ["Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Berserk Control",
    maxLv: 1,
    effect: "For each level of \"Berserk\", 10% chance to prevent \"Rampage\" from being cancelled",
    desc: "",
    from: ["Unknown"]
  },
  {
    name: "Berserk Rush",
    maxLv: 5,
    effect: "Reduces the negative effect of \"Berserk\" by (1 × Regislet Level)% if you take damage from a monster while the skill is active",
    desc: "",
    from: ["Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Binding Strike Modifier",
    maxLv: 1,
    effect: "Modifies \"Binding Strike\" so that it inflicts [Stun] to the target only and the [Stop] effect is removed",
    desc: "",
    from: ["Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Bloody Bite Enhancer",
    maxLv: 10,
    effect: "Raises the power of \"Bloody Bite\" by 10% × Registlet Level",
    desc: "",
    from: ["Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp"]
  },
  {
    name: "Bloody Warrior",
    maxLv: 20,
    effect: "Raises normal attack power and Attack MP Recovery by (5% × Registlet Level) while afflicted with Bleed",
    desc: "",
    from: ["Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Blue Zone Shield",
    maxLv: 10,
    effect: "Reduces the damage from monster attacks shown with a blue warning by 1(+1 per Regislet Level)%. However, damage taken from single-target attacks increases by 10%",
    desc: "This damage reduction applies multiplicatively with other damage reductions such as Refinement, Resistance",
    from: ["Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Bullseye Enhancer",
    maxLv: 20,
    effect: "Raises the power of \"Bullseye\" by (5% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest"]
  },
  {
    name: "Burning Spirit",
    maxLv: 10,
    effect: "Restores MP as much as (5 × Registlet Level)% of your Attack MP Recovery when taking damage inflicted by Ignite",
    desc: "",
    from: ["Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Cannon Spear Enhancer",
    maxLv: 10,
    effect: "Adds a (10% × Registlet Level) chance of inflicting \"Flinch\" to the first attack of the skill \"Cannon Spear\"",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest"]
  },
  {
    name: "Cat's Eye",
    maxLv: 1,
    effect: "A MISS hit while you are Blind may be turned into a GRAZE hit when possible",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Chancy Trap",
    maxLv: 1,
    effect: "Enables a trap skill to be set at the target's feet, but if it activates immediately, you will also be affected",
    desc: "",
    from: ["Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Check Out Notice",
    maxLv: 1,
    effect: "When you get knocked out, you will declare it through Party Chat. If it is a Guild RAID, you will declare it through Say Chat",
    desc: "",
    from: ["Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Coffee Break",
    maxLv: 10,
    effect: "Restores 10% of your HP when you defeat a monster. Cooldown: (30 - Registlet Level) seconds",
    desc: "",
    from: ["Stoodie Lv130 - Monster's Forest", "Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Comrade Familia",
    maxLv: 1,
    effect: "The chance of the familiar summoned with \"Familia\" fleeing is reduced by 1%. Movement becomes 1 second faster for Advanced Familiar",
    desc: "",
    from: ["Stoodie Lv190 - Ducia Coast", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Critical Charging Slash",
    maxLv: 10,
    effect: "Lowers the power of \"Charging Slash\" by [110 - (10 × Registlet Level)]% and guarantees a critical hit",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine"]
  },
  {
    name: "Cross Parry Enhancer",
    maxLv: 20,
    effect: "Raises the power of \"Cross Parry\" by (5% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest"]
  },
  {
    name: "Damage Check",
    maxLv: 1,
    effect: "Displays an additional warning message when stepping on a warning area if the damage from the attack exceeds 50% of your current HP",
    desc: "",
    from: ["Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Dark Talent",
    maxLv: 1,
    effect: "Sets skill effects that change based on element to dark element",
    desc: "This Element Only Change Skill Ailment Inflict Not Skill Element",
    from: ["Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Decoy Shot Compress",
    maxLv: 10,
    effect: "Halves the duration of \"Decoy Shot\" but increases the power by (10% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp"]
  },
  {
    name: "Direct Sonic Thrust",
    maxLv: 1,
    effect: "The skill \"Sonic Thrust\" loses its swift effect, but gains an effect that ignores Evasion in return",
    desc: "",
    from: ["Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Distant Buster Lance",
    maxLv: 10,
    effect: "Increases the power of \"Buster Lance\" by (10% per Regislet Level). The range and distance at which the power starts to weaken is increased, making it always a long-range attack",
    desc: "",
    from: ["Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Distinct Parabola Cannon",
    maxLv: 1,
    effect: "The skill \"Parabola Cannon\" now only hits monsters currently in combat and guarantees a critical hit",
    desc: "",
    from: ["Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Dodge Boost",
    maxLv: 10,
    effect: "Increases Dodge by (1 per Regislet Level)",
    desc: "",
    from: ["Stoodie Lv10 - Underground Ruins", "Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv230 - Kabla Jabali", "Stoodie Lv250 - Pipeline Corridor", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Dominant War Cry",
    maxLv: 1,
    effect: "Activation of \"War Cry\" will not be interrupted by Fear",
    desc: "",
    from: ["Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Dragon Fire Release",
    maxLv: 10,
    effect: "The time to cast [Fire Release] is increased by 1 second, but the skill gains (2.5 × Regislet Level)% Magic Pierce. This increase in Magic Pierce doubles if [Blazing Explosion] is triggered",
    desc: "",
    from: ["Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Dragon Tail Enhancer",
    maxLv: 20,
    effect: "Raises the power of the second hit of \"Dragon Tail\" by (5% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine"]
  },
  {
    name: "Eagle Eye",
    maxLv: 10,
    effect: "Reduces damage taken from behind (opposite camera direction) by 1% × Registlet Level. The damage will be further reduced when taken from directly behind",
    desc: "",
    from: ["Stoodie Lv130 - Monster's Forest", "Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Earth Talent",
    maxLv: 1,
    effect: "Sets skill effects that change based on element to Earth element",
    desc: "This Element Only Change Skill Ailment Inflict Not Skill Element",
    from: ["Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Earthbind Enhancer",
    maxLv: 10,
    effect: "Raises the power of \"Earthbind\" by (5% × Registlet Level) if used with knuckles",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine"]
  },
  {
    name: "Elemental Trigger Slash",
    maxLv: 1,
    effect: "Converts the element of \"Trigger Slash\" from fire to that of the weapon equipped",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Emergency Care",
    maxLv: 10,
    effect: "Reduces the MP Aggro triggered by \"First Aid\" by (1 × Regislet Level). Up to MP Cost 100 at the minimum.",
    desc: "",
    from: ["Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Emergency HP Heal",
    maxLv: 10,
    effect: "Instantly restores (10 + Registlet Level)% of your HP when there is only 25% or less due to monster's attacks. Cooldown: 60 seconds",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Emergency MP Heal",
    maxLv: 10,
    effect: "Immediately restores (10 × Registlet Level) MP if there is not enough MP. Cooldown: 60 seconds",
    desc: "",
    from: ["Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Emergency Repair",
    maxLv: 20,
    effect: "There is a (5 × Registlet Level)% chance of having Armor Break status removed when the damage taken increases because of it",
    desc: "",
    from: ["Stoodie Lv130 - Monster's Forest", "Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Ether Flare Extender",
    maxLv: 1,
    effect: "Doubles the duration of the [Ether Flare] buff, but halves the buff's AMPR gain",
    desc: "",
    from: ["Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Evasion Set",
    maxLv: 1,
    effect: "Evasion becomes usable even with equipment that doesn't allow it",
    desc: "",
    from: ["Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Evasive Floating Kick",
    maxLv: 1,
    effect: "Gain [Invincible] for 1 second if [Floating Kick] is activated while moving",
    desc: "",
    from: ["Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Exclusive Bodyguard",
    maxLv: 10,
    effect: "Reduces the Physical/Magic/Fractional Damage received by the mercenary or partner summoned as a \"Defender\" by (3 × Regislet Level)%",
    desc: "",
    from: ["Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Express Assault Attack",
    maxLv: 10,
    effect: "Removes [Knock Back] and [Slow] from \"Assault Attack\" and increases its power by (10% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Extra Recovery",
    maxLv: 5,
    effect: "Adds a HP recovery effect to the skill \"Recovery\". The amount of HP restored is (10 × Registlet Level)% of the HP recovered by the Mini Heal learned",
    desc: "",
    from: ["Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Extreme Chronos Shift",
    maxLv: 5,
    effect: "\"Chronos Shift\" can be activated even if there is not enough MP by consuming HP. 60(-10% per Regislet Level)% HP is required per 100 MP you're short of. This HP consumption could get you knocked out",
    desc: "",
    from: ["Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Extreme Concentrate",
    maxLv: 5,
    effect: "Increases the activation rate of \"Concentrate\" by 1% per Registlet Level",
    desc: "",
    from: ["Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp"]
  },
  {
    name: "Extreme Whack",
    maxLv: 5,
    effect: "Increases the activation rate of \"Whack\" by 1% per Registlet Level",
    desc: "",
    from: ["Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Fighter's Magic: Impact",
    maxLv: 1,
    effect: "Changes the proration dealt by [Magic: Impact] to physical proration",
    desc: "",
    from: ["Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Final Resistance",
    maxLv: 5,
    effect: "If you get knocked out last in the party, you will squeeze out every last bit of your strength to quickly revive for (5 + Registlet Level) seconds before becoming unable to battle again",
    desc: "First Aid, Struggle, Revive Droplets Unavailable",
    from: ["Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Fire Talent",
    maxLv: 1,
    effect: "Sets skill effects that change based on element to Fire element",
    desc: "This Element Only Change Skill Ailment Inflict Not Skill Element",
    from: ["Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Flash Stab Enhancer",
    maxLv: 20,
    effect: "Raises the power of \"Flash Stab\" by (5% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest"]
  },
  {
    name: "Focus Demon Claw",
    maxLv: 1,
    effect: "The power of \"Demon Claw\" is reduced by 100% but the skill will focus on attacking a single target",
    desc: "",
    from: ["Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Focus Dive Impact",
    maxLv: 5,
    effect: "Turns the skill \"Dive Impact\" into an attack that pierces through a single target. Resistance to Dazzled is shortened by (2 seconds × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Focus Resonance",
    maxLv: 9,
    effect: "\"Resonance\" will only enhance stats that affect concentration and precision, but the enhancement is reduced by [95 - (5 × Registlet Level)]%",
    desc: "",
    from: ["Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Forty Winks",
    maxLv: 5,
    effect: "Shortens Sleep duration by (10% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Frugal Breathwork",
    maxLv: 1,
    effect: "Reduces the MP Cost of [Breathwork] by 100",
    desc: "",
    from: ["Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Frugal Heal",
    maxLv: 1,
    effect: "Reduces the MP Cost of the skill \"Heal\" by 100",
    desc: "",
    from: ["Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Frugal Shield Bash",
    maxLv: 10,
    effect: "Restores (10 × Registlet Level) MP when \"Shield Bash\" inflicts [Stun]",
    desc: "",
    from: ["Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv230 - Kabla Jabali", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Full Power Qi Charge",
    maxLv: 10,
    effect: "When \"Qi Charge\" gives no effect, qi will increase by (10 × Registlet Level)% if the skill is activated using 2000 MP",
    desc: "",
    from: ["Stoodie Lv170 - Labilans Sector", "Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Guitarist",
    maxLv: 6,
    effect: "Allows smooth song resumption with Ad-lib. A successful Parry with Ad-lib grants [Regislet Level] stack(s) of Beat Blast",
    desc: "",
    from: ["Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Hard Hit Enhancer",
    maxLv: 20,
    effect: "Raises the power of \"Hard Hit\" by (5% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest"]
  },
  {
    name: "Heal Bank",
    maxLv: 10,
    effect: "The amount of HP recovered by \"Mini Heal\" and \"Heal\" is halved. Accumulates up to [Registlet Level] stacks of buff every 3 sec. When using the skill to heal an ally, the buff is consumed instead of MP to activate it",
    desc: "",
    from: ["Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Healing Hands",
    maxLv: 10,
    effect: "Alleviates the reduced recovery of Heal-related Regislets by (10% per Regislet Level)",
    desc: "",
    from: ["Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Holy Light Retribution",
    maxLv: 10,
    effect: "There is a 1% chance that Lv[Registlet Level] light element Magic: Finale will activate when \"Holy Light\" hits the target",
    desc: "",
    from: ["Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Impetus",
    maxLv: 10,
    effect: "Reduces movement speed decline due to Slow by (5% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Instructor",
    maxLv: 10,
    effect: "Sets your own EXP Gain to 0 to increase the EXP Gain of the party member with the lowest level by 1% per Regislet Level. Less effective if there are multiple recipients",
    desc: "",
    from: ["Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Invincible Dauntless",
    maxLv: 3,
    effect: "\"Dauntless\" accumulates 1 second faster, but the count will decrease by 9(- 3 per Regislet Level) when taking damage. However, it won't decrease if the damage is blocked with Guard or certain Mononofu skills",
    desc: "",
    from: ["Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Iron Fist",
    maxLv: 5,
    effect: "Guard Break increases by (1% per Regislet Level) when barehanded or equipping knuckles (main only). The amount increased will be tripled if sub-weapon is empty",
    desc: "",
    from: ["Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Ironhearted Chronos Drive",
    maxLv: 1,
    effect: "Changes the additional attack effect of \"Chronos Drive\" from magic attack (based on INT) to physical attack (based on STR)",
    desc: "Scaling remains the same. Proration usage of additional hits changes to physical proration",
    from: ["Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Issen Enhancer",
    maxLv: 20,
    effect: "Raises the power of the second hit of \"Issen\" by (5% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest"]
  },
  {
    name: "Knight's Intuition",
    maxLv: 5,
    effect: "Anticipate increases by 5% if a one-handed sword is equipped, Equipping a shield will triple the amount increased",
    desc: "",
    from: ["Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Last Hero",
    maxLv: 10,
    effect: "Restores (10 + Registlet Level)% of your HP and MP per knocked out party member when you are the only one left. Cooldown: 300 seconds",
    desc: "",
    from: ["Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv190 - Ducia Coast"]
  },
  {
    name: "Light Talent",
    maxLv: 1,
    effect: "Sets skill effects that change based on element to light element",
    desc: "This Element Only Change Skill Ailment Inflict Not Skill Element",
    from: ["Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Lunar Slash Absorber",
    maxLv: 10,
    effect: "All \"Lunar Slash\" stacks are now consumed and MP is restored based on the number of stacks consumed. MP recovery amount is 1 MP × Regislet Level × Lunar Slash Stack Consumed. Lunar Slash stack additional damage is disabled when equipping this regislet",
    desc: "",
    from: ["Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Magadachi Amulet",
    maxLv: 6,
    effect: "Raises magic damage reduction by the skill \"Magadachi\" by (5% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Magic Attack Boost",
    maxLv: 30,
    effect: "Increases MATK by (1 per Regislet Level)",
    desc: "",
    from: ["Stoodie Lv10 - Underground Ruins", "Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv230 - Kabla Jabali", "Stoodie Lv250 - Pipeline Corridor", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Magic Defense Boost",
    maxLv: 50,
    effect: "Increases MDEF by (1 per Regislet Level)",
    desc: "",
    from: ["Stoodie Lv10 - Underground Ruins", "Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv230 - Kabla Jabali", "Stoodie Lv250 - Pipeline Corridor", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Magic Speed Boost",
    maxLv: 100,
    effect: "Increases CSPD by (1 per Regislet Level)",
    desc: "",
    from: ["Stoodie Lv10 - Underground Ruins", "Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv230 - Kabla Jabali", "Stoodie Lv250 - Pipeline Corridor", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Magic: Arrows Enhancer",
    maxLv: 4,
    effect: "Adds 1 shot per Registlet Level to the skill \"Magic: Arrows\"",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Magic: Blast Catalyst",
    maxLv: 5,
    effect: "Shortens the time to cast the skill \"Magic: Blast\" by 0.2 seconds per Registlet Level",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Magic: Lances Catalyst",
    maxLv: 5,
    effect: "Shortens the interval between shots of the skill \"Magic: Lances\" by 0.1 seconds per Registlet Level",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Magic: Storm Extender",
    maxLv: 5,
    effect: "Lowers the power of \"Magic: Storm\" by 50% to make its effect last 1s(+1s per Regislet Level) longer",
    desc: "",
    from: ["Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Magic: Wall Enhancer",
    maxLv: 20,
    effect: "Raises the power of \"Magic: Wall\" by (5% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest"]
  },
  {
    name: "Mana Crystal Catalyst",
    maxLv: 5,
    effect: "Reduces the casting time of \"Mana Crystal\" by (10 × Registlet Level)%, but the amount of MP recovered gets reduced by 100",
    desc: "",
    from: ["Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Mana Defuser",
    maxLv: 1,
    effect: "Immediately restores 100 MP if you survive a Mana Explosion",
    desc: "",
    from: ["Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Mana Thrash",
    maxLv: 1,
    effect: "Raises normal attack power in exchange for Attack MP Recovery",
    desc: "Power increases more with higher Attack MP Recovery",
    from: ["Stoodie Lv110 - Blazing Graben", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Max HP Boost",
    maxLv: 100,
    effect: "Increases HP by (10 × Regislet Level)",
    desc: "",
    from: ["Stoodie Lv10 - Underground Ruins", "Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv230 - Kabla Jabali", "Stoodie Lv250 - Pipeline Corridor", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Max MP Boost",
    maxLv: 100,
    effect: "Increases MP by (1 per Regislet Level)",
    desc: "",
    from: ["Stoodie Lv10 - Underground Ruins", "Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv230 - Kabla Jabali", "Stoodie Lv250 - Pipeline Corridor", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Maximizer Converter",
    maxLv: 1,
    effect: "Switches [Maximizer] to activate MP Charge instead when used alone",
    desc: "Not part of a combo and the condition for instant activation is not met",
    from: ["Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Mega Demon Wind Shuriken",
    maxLv: 2,
    effect: "MP Cost of [Demon Wind Shuriken] increases by [200 - (100 × Regislet Level)], but, in exchange, the number of times the shuriken can hit without reduced damage is increased by 1",
    desc: "",
    from: ["Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Mega Royal Heal",
    maxLv: 8,
    effect: "The range of \"Royal Heal\" effect is increased by 1m per Registlet Level, but the amount of HP restored is halved",
    desc: "",
    from: ["Stoodie Lv190 - Ducia Coast", "Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Mega War Cry of Struggle",
    maxLv: 10,
    effect: "Increases the aggro generated by the skill \"War Cry of Struggle\" by (300 × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine"]
  },
  {
    name: "Meikyo Shisui Preserver",
    maxLv: 1,
    effect: "The effect from \"Meikyo Shisui\" remains when using a skill",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Meteor Magic: Crash",
    maxLv: 5,
    effect: "The meteorites from \"Magic: Crash\" become much smaller in size, but the time of impact is shortened by (0.1 × Regislet Level - 0.1) and all meteorites will drop down even when not hitting the target",
    desc: "",
    from: ["Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Monophobia",
    maxLv: 5,
    effect: "Restores 100 HP per 10 seconds when near a party member, but when not, 100 HP will be lost. Range is (3 + Registlet Level) meters",
    desc: "This HP loss won't knock player out",
    from: ["Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Monster Hunter",
    maxLv: 10,
    effect: "Restores 100 MP when you defeat a monster. Cooldown: (30 - Registlet Level) seconds",
    desc: "",
    from: ["Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Moonlight Crescent Saber",
    maxLv: 5,
    effect: "While \"Crescent Saber\" is active, all aggro generated will be reduced by 15% per Regislet Level. This effect does not activate if you are being targeted",
    desc: "",
    from: ["Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Neural Control",
    maxLv: 30,
    effect: "Reduces the amount of ASPD lowered due to Paralysis by (2% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Panic",
    maxLv: 10,
    effect: "Restores (10 × Registlet Level) MP every 3 seconds, but all MP will be lost if you get aggro and this Registlet will be suspended for 30 seconds",
    desc: "",
    from: ["Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Paralysis Shot Extender",
    maxLv: 10,
    effect: "Extends the duration of buff from the skill \"Paralysis Shot\" by 1 second per Registlet Level",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine"]
  },
  {
    name: "Parrier Storm Blaze",
    maxLv: 1,
    effect: "A Guard check is added to the skill \"Storm Blaze\". A successful Guard will double the amount of MP recovered",
    desc: "",
    from: ["Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Parsimony",
    maxLv: 10,
    effect: "Instead of consuming a triggered auto-item, the item cooldown is doubled. Cooldown: (40 - Registlet Level) seconds",
    desc: "",
    from: ["Stoodie Lv110 - Blazing Graben", "Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Perfect Triple Thrust",
    maxLv: 10,
    effect: "Restores (10 × Regislet Level) MP if [Triple Thrust] is successfully activated without taking any damage when used alone",
    desc: "",
    from: ["Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Phantom Slash Enhancer",
    maxLv: 20,
    effect: "Raises the power of \"Phantom Slash\" by (5% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp"]
  },
  {
    name: "Physical Attack Boost",
    maxLv: 30,
    effect: "Increases ATK by (1 per Regislet Level)",
    desc: "",
    from: ["Stoodie Lv10 - Underground Ruins", "Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv230 - Kabla Jabali", "Stoodie Lv250 - Pipeline Corridor", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Physical Defense Boost",
    maxLv: 50,
    effect: "Increases DEF by (1 per Regislet Level)",
    desc: "",
    from: ["Stoodie Lv10 - Underground Ruins", "Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv230 - Kabla Jabali", "Stoodie Lv250 - Pipeline Corridor", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Piercing Heavy Smash",
    maxLv: 10,
    effect: "Adds (5 × Registlet Level)% Physical Pierce to the skill \"Heavy Smash\" if used with knuckles",
    desc: "",
    from: ["Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp"]
  },
  {
    name: "Poison Heal",
    maxLv: 30,
    effect: "(1% × Registlet Level) chance of having Poison status removed when taking damage inflicted by Poison",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Pommel Strike Enhancer",
    maxLv: 5,
    effect: "Extends the duration of Paralysis caused by the skill \"Pommel Strike\" by 1 second per Registlet Level",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Power Resonance",
    maxLv: 9,
    effect: "\"Resonance\" will only enhance stats that affect firepower, but the enhancement is reduced by [95 - (5 × Registlet Level)]%",
    desc: "",
    from: ["Stoodie Lv170 - Labilans Sector", "Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Power Shot Boost",
    maxLv: 20,
    effect: "Raises the power of \"Power Shot\" by (15% × Registlet Level) when Tumble is inflicted",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest"]
  },
  {
    name: "Power Wave Modifier",
    maxLv: 10,
    effect: "Modifies the effect of \"Power Wave\" so that it raises normal attack power by [(Registlet Level + Power Wave Level) × 0.5]% instead of extending the range",
    desc: "The increment depends on the skill level",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine"]
  },
  {
    name: "Protection Aegis",
    maxLv: 1,
    effect: "When [Protection] is activated, the [Aegis] you've acquired will also be activated at the same time. Likewise, when [Aegis] is activated, the [Protection] you've acquired will also be activated at the same time",
    desc: "",
    from: ["Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Purifying Twin Buster Blade",
    maxLv: 3,
    effect: "The power of \"Twin Buster Blade\" now increases based on the number of debuffs (max 1 types × Regislet Level) on the target",
    desc: "",
    from: ["Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Pursuit Relief",
    maxLv: 20,
    effect: "Reduces damage taken by (1% × Registlet Level) when you can't move while afflicted with Flinch, Tumble, or Stun",
    desc: "",
    from: ["Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Pyrexia",
    maxLv: 20,
    effect: "The chance of having Freeze status removed if you do a normal attack while frozen increases by (5% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv110 - Blazing Graben", "Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Rage Sword Enhancer",
    maxLv: 10,
    effect: "Raises the power of \"Rage Sword\" by 10% per Registlet Level. Aggro doubles if the target is hostile towards you",
    desc: "",
    from: ["Stoodie Lv190 - Ducia Coast", "Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Red Zone Shield",
    maxLv: 10,
    effect: "Reduces the damage from monster attacks shown with a red warning by 1(+1 per Regislet Level)%. However, damage taken from single-target attacks increases by 10%",
    desc: "This damage reduction applies multiplicatively with other damage reductions such as Refinement, Resistance",
    from: ["Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Remedial Rampage",
    maxLv: 10,
    effect: "Removes the finishing attack of the skill \"Rampage\" and restores (50 HP × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp"]
  },
  {
    name: "Role Model",
    maxLv: 10,
    effect: "Greatly suppresses your own damage output to increase your party members' EXP Gain by 1(+1 per Regislet Level)%",
    desc: "",
    from: ["Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Savior",
    maxLv: 1,
    effect: "Grants a 10-second invincibility if you revive when all of your party members get knocked out",
    desc: "",
    from: ["Stoodie Lv130 - Monster's Forest", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Secret Chase ATK Boost",
    maxLv: 1,
    effect: "Increases the activation rate of additional attack of \"Secret Chase Attack\" by 1% per level of the skill acquired",
    desc: "",
    from: ["Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Secret Combo",
    maxLv: 10,
    effect: "Reduces aggro by (Registlet Level)% per 1 combo. Better effect with longer combo",
    desc: "",
    from: ["Stoodie Lv170 - Labilans Sector", "Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Shared Destiny",
    maxLv: 10,
    effect: "Each party member excluding you will raise ATK and MATK by 1%, but [110 - (10 × Registlet Level)]% of HP will be lost whenever a member gets knocked out",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Shell Break Enhancer",
    maxLv: 5,
    effect: "Raises the chance to inflict Armor Break with the skill \"Shell Break\" by (5% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Short Performance",
    maxLv: 1,
    effect: "Shortens the duration of dance skill effect by 5 seconds. *Does not apply to Spirited Dance",
    desc: "",
    from: ["Stoodie Lv190 - Ducia Coast", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Silent P. Defense",
    maxLv: 10,
    effect: "Reduces the aggro generated when P. Defense is successful by (10 × Registlet Level)%",
    desc: "",
    from: ["Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Silent Recharge",
    maxLv: 20,
    effect: "Increase amount of MP recovered by (5% × Registlet Level) if \"MP Charge\" is used while afflicted with Silence",
    desc: "",
    from: ["Stoodie Lv110 - Blazing Graben", "Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Single Meteor Strike",
    maxLv: 1,
    effect: "Reduces the number of meteorites dropped from \"Meteor Strike\" to 1, but the drop point will no longer be random. It will no longer inflict status ailments either",
    desc: "",
    from: ["Stoodie Lv170 - Labilans Sector", "Stoodie Lv220 - Spring of Rebirth", "Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Smash Enhancer",
    maxLv: 20,
    effect: "Raises the power of \"Smash\" by (5% × Registlet Level) if used with knuckles",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest"]
  },
  {
    name: "Smoke Dust Extender",
    maxLv: 10,
    effect: "Extends the duration of buff from the skill \"Smoke Dust\" by (1 second × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp"]
  },
  {
    name: "Sneak Attack Timer",
    maxLv: 1,
    effect: "The skill \"Sneak Attack\" changes into a time-based buff instead of remaining use-based",
    desc: "",
    from: ["Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Sonic Blade Extender",
    maxLv: 20,
    effect: "Extends the time you must reuse \"Sonic Blade\" to turn it into \"Super Sonic Blade\" by 1 second per Registlet Level",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest"]
  },
  {
    name: "Sonic Wave Enhancer",
    maxLv: 20,
    effect: "Raises the power of \"Sonic Wave\" by (5% × Registlet Level) if used with knuckles",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest"]
  },
  {
    name: "Speed Resonance",
    maxLv: 9,
    effect: "\"Resonance\" will only enhance stats that affect acceleration, but the enhancement is reduced by [95 - (5 × Registlet Level)]%",
    desc: "",
    from: ["Stoodie Lv190 - Ducia Coast", "Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Spinning Slash Compress",
    maxLv: 10,
    effect: "Reduces the range of \"Spinning Slash\" and removes the knock back effect, but raises its power by (5% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine"]
  },
  {
    name: "Spiral Air Enhancer",
    maxLv: 20,
    effect: "Raises the power of \"Spiral Air\" by (2% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine"]
  },
  {
    name: "Sprint Sheathe Remover",
    maxLv: 1,
    effect: "Sheathing while moving will no longer occur",
    desc: "",
    from: ["Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Start Dash",
    maxLv: 5,
    effect: "Normal attack has 0 second cooldown for (5 + Registlet Level) seconds when getting aggro from the target monster for the first time. Cooldown: 60 seconds",
    desc: "",
    from: ["Stoodie Lv170 - Labilans Sector", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Static Triple Thrust",
    maxLv: 1,
    effect: "You will remain in the same spot when using the skill \"Triple Thrust\"",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest", "Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Steady Stance",
    maxLv: 10,
    effect: "Reduces damage taken while afflicted with Stop by (3% × Registlet Level) if you stand still",
    desc: "",
    from: ["Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation"]
  },
  {
    name: "Sunbath",
    maxLv: 4,
    effect: "When using Emotions that increase Natural Regen, an additional (25 × Registlet Level)% of MP will be restored",
    desc: "",
    from: ["Stoodie Lv10 - Underground Ruins", "Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Sword Tempest Extender",
    maxLv: 1,
    effect: "Adds 1 hit to the skill \"Sword Tempest\"",
    desc: "",
    from: ["Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv170 - Labilans Sector", "Stoodie Lv190 - Ducia Coast", "Stoodie Lv210 - Fugitive Lake Swamp", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Tanker's Pet",
    maxLv: 10,
    effect: "Lowers the damage received by pet by (3% × Registlet Level), but greatly increases the damage received by its owner",
    desc: "",
    from: ["Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Target Declaration",
    maxLv: 1,
    effect: "When you are drawing the enemy's attention (aggro), you will declare it through Party Chat. If it is a Guild RAID, you will declare it through Say Chat",
    desc: "",
    from: ["Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Transfer",
    maxLv: 10,
    effect: "Lowers MaxMP by [1100 - (100 × Registlet Level)], but when you are knocked out, the remaining MP will be shared among your party members",
    desc: "Players whose MP gets restored by this effect cannot enjoy the same effect for 180 seconds",
    from: ["Stoodie Lv150 - Dark Dragon Shrine", "Stoodie Lv250 - Pipeline Corridor"]
  },
  {
    name: "Tricky Shadow Walk",
    maxLv: 1,
    effect: "Additional attack of \"Shadow Walk\" will no longer cause proration",
    desc: "",
    from: ["Stoodie Lv190 - Ducia Coast", "Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Twin Slash Enhancer",
    maxLv: 20,
    effect: "Raises the critical damage from \"Twin Slash\" by (1% × Registlet Level)",
    desc: "",
    from: ["Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation", "Stoodie Lv110 - Blazing Graben", "Stoodie Lv130 - Monster's Forest"]
  },
  {
    name: "Universal Ether Flare",
    maxLv: 1,
    effect: "\"Ether Flare\" will recover Attack MP even if the element is not the target's weakness",
    desc: "",
    from: ["Unknown"]
  },
  {
    name: "Unsheather Wind Release",
    maxLv: 10,
    effect: "Adds Magic Pierce (5% per Regislet Level) attribute to the skill \"Wind Release\" and when the skill changes, an Unsheathe Attack attribute is added",
    desc: "",
    from: ["Stoodie Lv230 - Kabla Jabali"]
  },
  {
    name: "Violent Lunar Misfortune",
    maxLv: 10,
    effect: "While Storm Reaper's buff is active the skill \"Lunar Misfortune\" becomes a close-range attack regardless of distance. (15 - Regislet Level) seconds cooldown after activation",
    desc: "",
    from: ["Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Water Release: Aqua Mirror",
    maxLv: 1,
    effect: "Changes \"Water Release\" from a deployable skill to a buff skill",
    desc: "",
    from: ["Stoodie Lv270 - Menabra Plains"]
  },
  {
    name: "Water Talent",
    maxLv: 1,
    effect: "Sets skill effects that change based on element to Water element",
    desc: "This Element Only Change Skill Ailment Inflict Not Skill Element",
    from: ["Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Wayfarer",
    maxLv: 10,
    effect: "Increases EXP Gain by 10% but lowers damage dealt by (15 - Registlet Level)%",
    desc: "",
    from: ["Stoodie Lv10 - Underground Ruins", "Stoodie Lv30 - Fiery Volcano", "Stoodie Lv50 - Ancient Empress's Tomb", "Stoodie Lv70 - Gravel Terrace", "Stoodie Lv90 - Garden of Sublimation"]
  },
  {
    name: "Wind Talent",
    maxLv: 1,
    effect: "Sets skill effects that change based on element to wind element",
    desc: "This Element Only Change Skill Ailment Inflict Not Skill Element",
    from: ["Stoodie Lv220 - Spring of Rebirth"]
  },
  {
    name: "Zero Stance",
    maxLv: 10,
    effect: "Damage dealt with skill activated without using a combo is multiplied by [1 + (0.01 × Registlet Level)]. *Does not apply to some skills such as charge skills",
    desc: "",
    from: ["Stoodie Lv170 - Labilans Sector", "Stoodie Lv250 - Pipeline Corridor"]
  }
];

function searchRegislet(query) {
  const q = query.toLowerCase().trim();
  return regislets.filter(r => r.name.toLowerCase().includes(q));
}

function searchByLocation(loc) {
  const q = loc.toLowerCase().trim();
  return regislets.filter(r =>
    r.from.some(f => f.toLowerCase().includes(q))
  );
}

function formatRegislet(r) {
  let msg = `🔮 *${r.name}*\n`;
  msg += `━━━━━━━━━━━━━━━\n`;
  msg += `📊 *Max Level:* ${r.maxLv}\n`;
  msg += `⚡ *Effect:*\n${r.effect}\n`;
  if (r.desc && r.desc !== "" && r.desc !== "No description") {
    msg += `\n📝 *Note:* ${r.desc}\n`;
  }
  msg += `\n📍 *Obtained From:*\n`;
  if (r.from[0] === "Unknown") {
    msg += `  • Unknown\n`;
  } else {
    for (const loc of r.from) {
      msg += `  • ${loc}\n`;
    }
  }
  return msg.trim();
}

module.exports = { searchRegislet, searchByLocation, formatRegislet, regislets };