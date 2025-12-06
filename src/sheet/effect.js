import ZoneConfig from "../apps/zone-config";

export default class OldWorldActiveEffectConfig extends WarhammerActiveEffectConfig 
{
    systemTemplate="systems/whtow/templates/partials/effect-zones.hbs"

    static DEFAULT_OPTIONS = {
        advancedActions : {
            zoneConfig : this._onZoneConfig
        }
    };

    static _onZoneConfig(ev, target)
    {
        new ZoneConfig(this.document).render({force : true});
    }


    hiddenProperties(){
        let hidden = super.hiddenProperties();
        hidden.equipTransfer = !this.document.item?.system?.isEquippable;
        return hidden;
    }
}