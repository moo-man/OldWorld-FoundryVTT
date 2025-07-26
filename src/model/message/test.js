export class OldWorldTestMessageModel extends WarhammerTestMessageModel 
{

    static get actions() {
        return foundry.utils.mergeObject(super.actions, {
        toggleDie : this._onToggleDie,
        expandItem : this._onExpandItem,
        rollMiscast : this._onRollMiscast,
        castSpell : this._onCastSpell,
        applyDamage : this._onApplyDamage,
        chatTest : this._onChatTest

       })
}

    /**
     * When a Test is created
     * 1. If this is a defensive test, register it as the response to an opposed test
     * 2. Additionally, if a defensive test, remove the opposed status on the defending actor
     * 3. If this is an attacking test, add the opposed status on the target actor
     * 
     * For all these steps, make sure the owner is doing the operation
     */
    async _onCreate(data, options, user)
    {
        let test = this.test;

        if (!test.context.preventOpposed)
        {

            if (game.user.id == user)
            {
                test.handleOpposed(this.parent);
            }

            // Find attacking test, if exists and is owner, register this test as response
            let defendingAgainst = game.messages.get(test.context.defending);
            if (warhammer.utility.getActiveDocumentOwner(defendingAgainst)?.id == game.user.id)
            {
                defendingAgainst.system.test.registerOpposedResponse(test);
            }

            // Clear opposed on defender
            if (defendingAgainst && game.user.id == user) // User who created test is the same as the defending actor
            {
                test.actor.system.clearOpposed();
            }

            // Add opposed message IDs to targets (if this user is the owner of the target)
            for(let actor of test.targets)
            {
                let owner = warhammer.utility.getActiveDocumentOwner(actor);
                if (owner?.id == game.user.id)
                {
                    actor.system.registerOpposed(test);
                }
            }
        }
    }

    /**
     *  Each time a test is updated, check opposed (add opposed messages if targets was added)
     *  Additionally, recompute and render any opposed results
     */
    async _onUpdate(data, options, user)
    {
        let test = this.test;
        if (game.user.id == user)
        {
            test.handleOpposed(this.parent);
        }

        // If updated test is defending, the owner should rerender to reflect any changes
        let opposed = test.opposedMessage;
        if (opposed && warhammer.utility.getActiveDocumentOwner(opposed)?.id == game.user.id)
        {
            opposed.system.renderResult(true);
        }
    }

    get test() 
    {
        let test = new (systemConfig().rollClasses[this.context.rollClass])(this);
        return test;
    }

    async getHeaderToken()
    {
      let token = this.test.actor.getActiveTokens()[0]?.document || this.test.actor.prototypeToken;

      let path = token.hidden ? "icons/svg/mystery-man.svg" : token.texture.src;

      if (foundry.helpers.media.VideoHelper.hasVideoExtension(path))
      {
        path = await game.video.createThumbnail(path, { width: 50, height: 50 }).then(img => chatOptions.flags.img = img)
      }

      return path;
      
    }

    async onRender(html)
    {
      let header = html.querySelector(".message-header");

      let test = this.test;

      let div = document.createElement("div")
      div.classList.add("message-token");
      let image = document.createElement("img");
      image.src = await this.getHeaderToken();
      image.style.zIndex = 1;
      div.appendChild(image);
      if (test.actor.isMounted && test.actor.mount)
      {
        div.classList.add("mounted");
        let mount = document.createElement("img");
        mount.src = this.test.actor.mount.getActiveTokens()[0]?.document?.texture.src
        mount.style.zIndex = 0;
        div.appendChild(mount);
    }
      header.insertBefore(div, header.firstChild);

      warhammer.utility.replacePopoutTokens(html);



      if (test.result.rerolls?.length)
      {
        let dice = html.querySelector(".dice");
        dice.addEventListener("mouseenter", async ev => {
            let breakdown = await renderTemplate("systems/whtow/templates/chat/tests/dice-breakdown.hbs", test)
            game.tooltip.activate(ev.target, {html: breakdown, direction:"LEFT"})
        })
        
      }


      this._checkOpposed(html)
    }

    _checkOpposed(html)
    {
        let test = this.test;

        // If attacking, success on the opposed test means a successful attack
        for(let tokenId of Object.keys(test.context.opposedIds))
        {
            let opposed = game.messages.get(test.context.opposedIds[tokenId])
            let element = html.querySelector(`.target-list [data-id='${tokenId}']`)
            if (opposed)
            {
                if (opposed.system.result.outcome == "success")
                {
                    element.classList.add("success")
                }
                else if (opposed.system.result.outcome == "failure")
                {
                    element.classList.add("failure")
                }
            }
        }

        // If defending, success on the opposed test means a failed defense
        if (test.context.defending)
        {
            let element = html.querySelector(`.defending-list [data-id='${test.context.defending}']`)
            let opposed = test.opposedMessage;
            if (opposed)
            {
                if (opposed.system.result.outcome == "success")
                {
                    element.classList.add("failure")
                }
                else if (opposed.system.result.outcome == "failure")
                {
                    element.classList.add("success")
                }
            }

        }
    }

    static _onExpandItem(ev, target) {
        target.parentElement.querySelector(".description").classList.toggle("expanded");
    }

    static _onToggleDie(ev, target)
    {
        target.classList.toggle("selected");
    }

    static _onRollMiscast(ev, target)
    {
        let test = this.test;
        test.actor.system.rollMiscast();
    }
    static async _onCastSpell(ev, target)
    {
        let test = this.test;

        let availableSpells = test.actor.itemTypes.spell.filter(i => i.system.lore == this.context.lore && i.system.cv <= test.actor.system.magic.casting.progress);

        if (availableSpells.length == 0)
        {
            return ui.notifications.error("TOW.Error.NoSpellsToCast", {localize: true})
        }

        let spell = (await ItemDialog.create(availableSpells, 1, {title : "Select Spell", text : "Select a Spell to Cast"}))[0]

        test.actor.system.castSpell(spell, test.result.potency, test);
    }

    static async  _onApplyDamage(ev, target)
    {
        let actors;
        if (game.user.targets.size)
        {
            actors = Array.from(game.user.targets).map(i => i.actor).filter(i => i);
        }
        else 
        {
            actors = this.test.targetTokens.map(i => i.actor);
        }
        actors.forEach(a => {
            a.system.applyDamage(this.result.damage.value, {item : this.item})
        })
    }

    static async _onChatTest(ev, target)
    {
        selectedWithFallback().forEach(a => {
            a.setupTestFromItem(this.test.item);
        })
    }
}
