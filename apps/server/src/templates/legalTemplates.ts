// apps/server/src/templates/legalTemplates.ts

export const SARL_TEMPLATE = `
**STATUTS DE LA SOCIÉTÉ À RESPONSABILITÉ LIMITÉE**
**"{{denomination}}"**

**Article 1 : Forme**
Il est formé une Société à Responsabilité Limitée (SARL) régie par l'Acte Uniforme de l'OHADA.

**Article 2 : Objet**
{{objetSocial}}

**Article 3 : Dénomination**
La dénomination sociale est : **{{denomination}}**

**Article 4 : Siège social**
Le siège social est fixé à : {{siegeSocial}}

**Article 5 : Capital social**
Le capital social est fixé à la somme de **{{capitalSocialCDF}} CDF**. Il est divisé en {{nombrePartsTotal}} parts sociales d'une valeur nominale de {{valeurPartCDF}} CDF chacune.
Répartition :
{{repartitionParts}}

**Article 6 : Gérance**
Est nommé gérant statutaire : **{{gerant}}**.

Fait à {{villeSignature}}, le {{dateSignature}}

**Les Associés :**
{{signaturesAssocies}}
`;

export const EI_TEMPLATE = `
**DÉCLARATION D'ACTIVITÉS D'UNE PERSONNE PHYSIQUE COMMERÇANTE**
**"{{denomination}}"**

**Article 1 : Identification**
L'entreprise fonctionnera sous l'enseigne : **{{denomination}}**.

**Article 2 : Objet**
{{objetSocial}}

**Article 3 : Siège**
Le siège est fixé à : {{siegeSocial}}.

**Article 4 : Promoteur**
Le créateur est **{{gerant}}**.

Fait à {{villeSignature}}, le {{dateSignature}}
`;

export const SA_TEMPLATE = `
**STATUTS DE LA SOCIÉTÉ ANONYME**
**"{{denomination}}"**

**Article 1 : Forme et Régime**
Il est formé une Société Anonyme régi par l'Acte Uniforme OHADA.

**Article 2 : Objet**
{{objetSocial}}

**Article 3 : Siège social**
Le siège social est fixé à : {{siegeSocial}}

**Article 4 : Capital social**
Le capital social est fixé à **{{capitalSocialCDF}} CDF**, divisé en {{nombrePartsTotal}} actions de valeur nominale {{valeurPartCDF}} CDF chacune.
Répartition :
{{repartitionParts}}

**Article 5 : Direction**
Le Conseil d'Administration nomme comme dirigeant principal : **{{gerant}}**.

Fait à {{villeSignature}}, le {{dateSignature}}

**Signatures :**
{{signaturesAssocies}}
`;

export const SAS_TEMPLATE = `
**STATUTS DE LA SOCIÉTÉ PAR ACTIONS SIMPLIFIÉE**
**"{{denomination}}"**

**Article 1 : Forme**
Société par Actions Simplifiée régie par l'Acte Uniforme OHADA.

**Article 2 : Objet**
{{objetSocial}}

**Article 3 : Siège social**
Le siège social est établi à : {{siegeSocial}}

**Article 4 : Capital**
Capital social : **{{capitalSocialCDF}} CDF** réparti en {{nombrePartsTotal}} actions de {{valeurPartCDF}} CDF.
Répartition :
{{repartitionParts}}

**Article 5 : Présidence**
Est nommé Président : **{{gerant}}**.

Fait à {{villeSignature}}, le {{dateSignature}}

**Signatures :**
{{signaturesAssocies}}
`;

export const SNC_TEMPLATE = `
**STATUTS DE LA SOCIÉTÉ EN NOM COLLECTIF**
**"{{denomination}}"**

**Article 1 : Forme**
Société en Nom Collectif régie par l'Acte Uniforme OHADA.

**Article 2 : Objet**
{{objetSocial}}

**Article 3 : Siège social**
Adresse du siège : {{siegeSocial}}

**Article 4 : Capital**
Capital social : **{{capitalSocialCDF}} CDF** réparti entre les associés comme suit :
{{repartitionParts}}

**Article 5 : Gérance**
Le gérant statutaire est : **{{gerant}}**.

Fait à {{villeSignature}}, le {{dateSignature}}

**Associés :**
{{signaturesAssocies}}
`;
