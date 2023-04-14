export class UsingAlias {
    // value which will be forwared to call the actual ability by its alias
    public abilityAlias?: string;

    /**
     * Set the alias which is used for an underlying ability
     *
     * @param alias with which an ability was initialized
     * @returns current action
     */
    public withAbilityAlias(alias: string | undefined) {
        this.abilityAlias = alias;
        return this;
    }
}
